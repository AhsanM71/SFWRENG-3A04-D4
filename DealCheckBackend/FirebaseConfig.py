import firebase_admin
from firebase_admin import credentials, auth

# Initialize the firebase app with the project credentials.
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(credential=cred)
