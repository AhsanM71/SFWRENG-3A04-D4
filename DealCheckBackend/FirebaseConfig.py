import firebase_admin
from firebase_admin import credentials, auth as authentication, firestore
import firebase_admin.firestore

# Initialize the firebase app with the project credentials.
cred = credentials.Certificate("./serviceAccountKey.json")
app = firebase_admin.initialize_app(credential=cred)
auth = authentication.Client(app=app)
db = firestore.client()