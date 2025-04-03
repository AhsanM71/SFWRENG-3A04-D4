import os
import firebase_admin
from firebase_admin import credentials, auth as authentication, firestore, storage

# Initialize the firebase app with the project credentials.
cred = credentials.Certificate("./serviceAccountKey.json")

app = firebase_admin.initialize_app(credential=cred, options={
    'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET")
})

auth = authentication.Client(app=app)
db = firestore.client()
bucket = storage.bucket()