from core.blackboard.expert.Expert import Expert
from core.dealCheck.data.DealCheckData import DealCheckData
from google import genai
from google.genai import types
import re
import asyncio
from bucket import uploadImage # Import the uploadImage function

class AIAgent(Expert[DealCheckData]):

    async def evaluateRequest(self, request: DealCheckData) -> DealCheckData:
        self.queue.append(request)
        id: int = len(self.queue) - 1
        return await self._processRequest(id=id)
    
    async def _processRequest(self, id: int) -> DealCheckData:
        request: DealCheckData = self.queue[id]
        del self.queue[id]

        # Construct the AI prompt dynamically from DealCheckData
        prompt_text = f"""
        Based on the following information, please generate a JSON output.
        The JSON output should be of the format:
        {{
            "prediction":X,
            "confidence":Y,
            "rationale":""
        }}
        X should be a prediction (YES or NO) that the following information constitutes a good car deal.
        Y is your confidence on a scale of 1-100 that you are correct on X.
        Aim to be confident, but do not falsify data.
        Finally, rationale should be your reasoning that you are correct.

        Here is your data:
        - Car: {request.car.getMake()} {request.car.getModel()}, {request.car.getYear()}
        - Mileage: {request.car.getMileage()} km
        - Condition: {request.car.getCondition()}
        - Accident History: {request.car.getAccidentHistory()}
        - Previous Owners: {request.car.getPreviousOwners()}
        - Inspection Completed: {request.inspection_completed}
        - Seller Type: {request.seller_type}
        - Warranty: {request.warranty}
        - Fuel Efficiency: {request.fuel_efficiency_mpg} MPG
        - Insurance Estimate: {request.insurance_estimate} CAD
        - Resale Value: {request.resale_value} CAD
        - Asking Price: {request.price} CAD
        """
        
        contents = [types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])]

        # Add image if available
        if request.image_base64:
            try:
                # Upload the image to Firebase Storage
                image_filename = await uploadImage(request.image_base64)
                # Modify prompt to include image information.
                prompt_text += f"\n\nAnalyze the provided image (filename: {image_filename}) in conjunction with the text data to determine the car's condition and any relevant details."
                contents[0].parts[0].text = prompt_text
            except Exception as e:
                print(f"Error processing image: {e}")
                request.confidence = 0
                request.actual = "NO%Unable to process image."
                return request

        # Setup AI request
        client = genai.Client(vertexai=True, project="dealcheck", location="global")

        generate_content_config = types.GenerateContentConfig(
            temperature=0.2,
            top_p=0.8,
            max_output_tokens=1024,
            response_modalities=["TEXT"],
            safety_settings=[
                types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF"),
            ],
        )

        # Generate response
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model="gemini-2.0-flash-001",
            contents=contents,
            config=generate_content_config,
        ):
            response_text += chunk.text

        match = re.search(r'"prediction": "(.*?)".*?"confidence": (\d+).*?"rationale": "(.*?)"', response_text, re.DOTALL)

        if match:
            prediction = match.group(1)
            confidence = int(match.group(2))
            rationale = match.group(3)
            request.confidence = confidence
            request.actual = f"{prediction}%{rationale}"
        else:
            request.confidence = 0
            request.actual = "NO%Unable to make decision."

        return request