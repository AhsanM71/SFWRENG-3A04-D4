import base64
import vertexai
import re
import json
import asyncio
import tempfile
import subprocess
from vertexai.generative_models import GenerativeModel, SafetySetting, Part
from core.blackboard.expert.Expert import Expert
from core.data.car.CarDAO import CarDAO
from core.data.car.Car import Car
from ..data.CarRecommendationInformation import CarRecommendationInformation
from bucket import uploadImageWithDeletion
from google import genai
from google.genai import types

class RecommendationAIExpert(Expert[CarRecommendationInformation]):
    _IMAGE_PATH = "decoded_image.jpg"
    async def evaluateRequest(self, request: CarRecommendationInformation) -> CarRecommendationInformation:
        request: CarRecommendationInformation = await self._generateScenarioBasedRecommendation(request)
        image: str = await self._generateDepricationCurve(request.getCar())
        request.setDepricationCurveImg(image)

        return request

    async def _generateScenarioBasedRecommendation(self, info: CarRecommendationInformation) -> CarRecommendationInformation:
        client = genai.Client(
        vertexai=True,
        project="dealcheck",
        location="us-central1",
        )
    
        # prefix = ["""I'm looking for an electric SUV under $50,000 that has great range, a spacious interior, and good tech features. I also drive in snowy conditions often. What's a good option?""",
        #         """I have a budget of $25,000 and need a fuel-efficient sedan for daily commuting and occasional road trips. I prefer something with good safety ratings and low maintenance costs. What would you recommend?""",
        #         """I need a reliable used car under $15,000 for city driving, with good gas mileage and low insurance costs. I don't need a lot of power, just something practical. Any recommendations?""",
        #         """I want a fun weekend sports car under $40,000 that's stylish, fast, and has good handling. It should also be somewhat practical for occasional daily use. What should I get?""",
        #         """I run a small business and need a durable pickup truck under $60,000 that can tow at least 8,000 lbs and handle off-road conditions. What are my best choices?"""]
        
        prompt = types.Part.from_text(text=f"""{info.getDescription()} Based on these requirements, recommend a car and provide the following details. However, for each value only provide the string, boolean, or integer value without any explanations. The explanation of why the recommended car is good based on the provided scenario should come from the Overall Description. Also for the Description (Key features of the car) ensure you use only 2 sentences:
            price Integer (price of such a car)
            make (e.g., Toyota, Honda)
            model (e.g., Camry, Accord)
            year (e.g., 2020)
            trim (specific trim level, e.g., EX, LE)
            mileage Integer
            condition (New, Used, or Salvage)
            accident_history Boolean (specify if we should buy a car with an accident history)
            previous_owners Integer (specify the number of owners the car should have) 
            description (Key features of the car)
            pros (List of advantages)
            cons (List of disadvantages)
            overall_description (A brief explanation of why this car is a good recommendation for my needs)
            Return the response in a structured JSON format.""")
        
        model = "gemini-2.0-flash-001"
        contents = [
        types.Content(role="user",parts=[prompt]),]
        
        generate_content_config = types.GenerateContentConfig(temperature = 0.2,top_p = 0.8,max_output_tokens = 1024,response_modalities = ["TEXT"],
        safety_settings = [types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH",threshold="OFF"),types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT",threshold="OFF"),types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold="OFF"),types.SafetySetting(category="HARM_CATEGORY_HARASSMENT",threshold="OFF")],)
        
        output = ""
        for chunk in client.models.generate_content_stream(model=model, contents=contents, config=generate_content_config):
            output += chunk.text

        cleaned_output = output.replace("```json\n", "").replace("```", "").strip()

        try:
            data = json.loads(cleaned_output)
            data["recommendation"]["image"] = None
            data["recommendation"]["id"] = None
            json.dumps(data)
        except json.JSONDecodeError as e:
            print("Failed to parse JSON:", e)
            
        car: Car = Car.from_dict(data.get("recommendation"))
        car: Car = CarDAO.addCar(car)
        
        info.setCarRecommendation(data["recommendation"]["overall_description"])
        info.setCar(car)
        info.setPrice(data["recommendation"]["price"])
        info.setPros(data["recommendation"]["pros"])
        info.setCons(data["recommendation"]["cons"])
        return info        

    async def _generateDepricationCurve(self, car: Car) -> str:
        generation_config, safety_settings = self._config_model()
        year = car.getYear()
        make = car.getMake()
        model = car.getModel()
        
        deprecationCurvePrompt = f"""Write a Python script to generate and save a depreciation curve using plt.savefig for the {year} {make} {model} using Matplotlib. Choose logical X and Y values. Don't use plt.show() and ensure the path where the image is saved is \"{self._IMAGE_PATH}\" Example:
        import numpy as np
        import matplotlib.pyplot as plt

        years = np.array([0, 1, 2, 3, 4, 5])
        values = np.array([25988, 25988, 24680, 22709, 21240, 20000])

        plt.figure(figsize=(8, 5))
        plt.plot(years, values, marker='o', linestyle='-', color='b', label=\"Honda Civic Value\")
        plt.xlabel(\"Years\")
        plt.ylabel(\"Estimated Value ($)\")
        plt.title(\"Depreciation Curve for 2024 Honda Civic\")
        plt.grid(True)
        plt.xticks(years)
        plt.legend()
        plt.savefig('{self._IMAGE_PATH}')"""

        vertexai.init(
            project="dealcheck",
            location="us-central1",
            api_endpoint="us-central1-aiplatform.googleapis.com"
        )
        
        model = GenerativeModel(
            "gemini-1.5-pro-001",
        )
        
        chat = model.start_chat()
        model_output = chat.send_message([deprecationCurvePrompt], generation_config=generation_config, safety_settings=safety_settings)
        program = self._get_text(model_output)
        
        script_path = ""
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp_script:
            script_path = temp_script.name
            temp_script.write(program.encode("utf-8"))

        try:
            result = await asyncio.to_thread(
                subprocess.run,
                ["python", script_path],
                capture_output=True,
                text=True,
                check=True
            )
            with open(self._IMAGE_PATH, "rb") as image_file:
                base64_string = base64.b64encode(image_file.read()).decode("utf-8")

            image = await uploadImageWithDeletion(self._IMAGE_PATH, base64_string)
        except subprocess.CalledProcessError as e:
            print("Error executing the script:", e.stderr)
        
        return image
        
    def _get_text(self, model_output):
            candidates = model_output.candidates
            if candidates:
                # print("First candidate:", candidates[0])
                candidate = candidates[0]

                if hasattr(candidate, 'content'):
                    content = candidate.content
                    # print("Content:", content) 

                    if hasattr(content, 'parts'):
                        input_string = content.parts[0].text 
                        code = re.search(r'```python\n(.*?)```', input_string, re.DOTALL)

                        if code:
                            return code.group(1)
                        else:
                            return "No code found."
                    else:
                        return "No parts in the content."
                else:
                    return "No content attribute found in the candidate."
            else:
                return "No candidates found."
        
    def _config_model(self):
        generation_config = {
        "max_output_tokens": 8192,
        "temperature": 1,
        "top_p": 0.95,
        }

        safety_settings = [
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
        ]
        return generation_config, safety_settings