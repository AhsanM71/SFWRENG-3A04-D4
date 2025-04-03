import base64
import vertexai
import re
from vertexai.generative_models import GenerativeModel, SafetySetting, Part
from blackboard import Expert
from core.data import Car
from ..data.CarRecommendationInformation import CarRecommendationInformation
from bucket import uploadImage

class RecommendationAIExpert(Expert[CarRecommendationInformation]):
    _IMAGE_PATH = "decoded_image.jpg"
    async def evaluateRequest(self, request: CarRecommendationInformation) -> CarRecommendationInformation:
        await self._generateDepricationCurve(request.getCar())
        
        with open(self._IMAGE_PATH, "rb") as image_file:
            base64_string = base64.b64encode(image_file.read()).decode("utf-8")
            
        image = uploadImage(self._IMAGE_PATH, base64_string)
        CarRecommendationInformation.setDepricationCurveImg(image)

    async def _generateScenarioBasedRecommendation(info: CarRecommendationInformation) -> CarRecommendationInformation:
        pass

    async def _generateDepricationCurve(self, car: Car) -> str:
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
        print(model_output)
        program = self._get_text(model_output)
        exec(program)
        
    def _get_text(model_output):
            candidates = model_output.candidates
            if candidates:
                print("First candidate:", candidates[0])
                candidate = candidates[0]

                if hasattr(candidate, 'content'):
                    content = candidate.content
                    print("Content:", content) 

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