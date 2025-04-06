from core.data.car.Car import Car
from vertexai.preview.vision_models import ImageGenerationModel
from bucket import uploadImage, delete_img
import vertexai
import asyncio
import tempfile
import subprocess
import base64
import re
from vertexai.generative_models import GenerativeModel, SafetySetting, Part
from bucket import uploadImageWithDeletion
from google import genai
from google.genai import types

vertexai.init(project="dealcheck", location="us-central1")

generation_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-002")
_IMAGE_PATH = "decoded_image.jpg"

async def generateCarImg(car: Car):
    carYear: int = car.getYear()
    carMake: str = car.getMake()
    carModel: str = car.getModel()

    images = await asyncio.to_thread(generation_model.generate_images,
        prompt=f"""
        The Image I want you to generate it is a {carYear} {carMake} {carModel}. And the car in the image is positioned at a three-quarter front-left 
        angle. This means that the front and left side of the car are visible, while the right side and rear are not in view. The car appears to be 
        slightly turned to the left, showing a dynamic perspective. Make the background white.
        """,
        number_of_images=1,
        aspect_ratio="1:1",
        negative_prompt="",
        person_generation="",
        safety_filter_level="",
        add_watermark=True,
    )

    path: str = './car'
    images[0].save(path)
    imgName: str = await uploadImage(path)
    delete_img(path)

    return imgName

async def generateDepricationCurve(year: str, make: str, model: str, price: str) -> str:
    generation_config, safety_settings = _config_model()

    deprecationCurvePrompt = f"""Write a Python script to generate and save a depreciation curve using plt.savefig for the {year} {make} {model} using Matplotlib with starting price of {price}. Choose logical X and Y values. Don't use plt.show() and ensure the path where the image is saved is \"{_IMAGE_PATH}\" Example:
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
    plt.savefig('{_IMAGE_PATH}')"""

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
    program = _get_text(model_output)

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
        with open(_IMAGE_PATH, "rb") as image_file:
            base64_string = base64.b64encode(image_file.read()).decode("utf-8")

        image = await uploadImageWithDeletion(_IMAGE_PATH, base64_string)
    except subprocess.CalledProcessError as e:
        print("Error executing the script:", e.stderr)

    return image

def _get_text(model_output):
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

def _config_model():
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