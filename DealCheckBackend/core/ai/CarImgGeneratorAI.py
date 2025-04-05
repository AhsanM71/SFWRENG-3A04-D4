from core.data.car.Car import Car
from vertexai.preview.vision_models import ImageGenerationModel
from bucket import uploadImage, _delete_img
import vertexai
import asyncio
import os
from uuid import uuid4

vertexai.init(project="dealcheck", location="us-central1")

generation_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-002")

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
    
    file_name = f"car_{uuid4().hex}.png"
    path: str = os.path.join('./', file_name)

    images[0].save(path)
    print(f"Image saved at: {path}")

    imgName: str = await uploadImage(path)
    _delete_img(path)

    return imgName