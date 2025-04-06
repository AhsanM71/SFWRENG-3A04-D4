from core.blackboard.expert.Expert import Expert
from core.dealCheck.data.DealCheckData import DealCheckData
from google import genai
from google.genai import types
import re
import base64
from bucket import delete_img
import binascii

class AIAgent(Expert[DealCheckData]):

    async def evaluateRequest(self, request: DealCheckData) -> DealCheckData:
        self.queue.append(request)
        id: int = len(self.queue) - 1
        return await self._processRequest(id=id)
    
    async def _processRequest(self, id: int) -> DealCheckData:
        request: DealCheckData = self.queue[id]
        rationale = ""
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
        Finally, rationale should be your reasoning that you are correct. Include a comment regarding the image of the vehicle if it is present, inside the rationale section.

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
        # Setup image
        encoded_image = base64.b64encode(open("./core/dealCheck/experts/saved_car.jpeg", "rb").read()).decode('utf-8')
        delete_img("./core/dealCheck/experts/saved_car.jpeg")
        image1 = types.Part.from_bytes(data=base64.b64decode(encoded_image), mime_type="image/jpeg")
        
        contents = [types.Content(role="user", parts=[types.Part.from_text(text=prompt_text),image1])]

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
            request.actual = prediction
            request.setRationale(rationale)
        else:
            request.confidence = 0
            request.actual = "NO"
            request.setRationale("Unable to make decision.")
        request.setExpertUsed("ai_agent")
        return request