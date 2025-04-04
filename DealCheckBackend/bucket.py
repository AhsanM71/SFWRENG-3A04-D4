import mimetypes
import asyncio
import base64
import os
from uuid import uuid4
from FirebaseConfig import bucket

async def uploadImage(filePath: str) -> str:
    '''
    Uploads an image from the disk to firebase storage

    Args:
        filePath (str): The path of the image on the disk to upload

    Returns:
        str: The name of the file in firebase storage, which can be used to generate a download url
    '''
    randName = uuid4().hex
    blob = bucket.blob(randName)

    # Determine file content type
    contentType, _ = mimetypes.guess_type(filePath)
    if not contentType:
        contentType = "application/octet-stream"

    # Asynchronously upload the file to firebase storage
    await asyncio.to_thread(blob.upload_from_filename, filename=filePath, content_type=contentType)

    # The name of the file in firebase storage
    return randName

async def uploadImageWithDeletion(filePath: str, image: str) -> str:
    '''
    Uploads an image from the disk to firebase storage

    Args:
        filePath (str): The path of the image on the disk to upload

    Returns:
        str: The name of the file in firebase storage, which can be used to generate a download url
    '''
    decode_img(filePath, image)
    randName = uuid4().hex
    blob = bucket.blob(randName)

    # Determine file content type
    contentType, _ = mimetypes.guess_type(filePath)
    if not contentType:
        contentType = "application/octet-stream"

    # Asynchronously upload the file to firebase storage
    await asyncio.to_thread(blob.upload_from_filename, filename=filePath, content_type=contentType)
    delete_img(filePath)
    # The name of the file in firebase storage
    return randName

def decode_img(path: str, base64_string: str):
    with open(path, "wb") as out_file:
        out_file.write(base64.b64decode(base64_string))

def delete_img(path):
    if os.path.exists(path):
        os.remove(path)