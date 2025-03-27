from FirebaseConfig import auth
import os
import requests
import asyncio
import json

class AccountLogin:
    async def login(self, email: str, password: str) -> str:
        '''
        Authenticates a user given the email and password

        Args:
            email (str): The email of the user being authenticated
            password (str): The password of the user being authenticated

        Returns:
            str: The user id of the authenticated user. NA otherwise.
        '''

        if not email or not password:
            raise Exception('Username and passwored are required fields!')
        
        return await self._requestAuthToken(email=email, password=password)
    
    async def _requestAuthToken(self, email: str, password: str) -> str:
        '''
        Sends a request to the identity tool kit google API to authenticate a user
        '''

        firebaseAPIKey = os.getenv("FIREBASE_API_KEY")
        firebaseAuthURL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}".format(FIREBASE_API_KEY=firebaseAPIKey)

        headers = {'Content-Type': 'application/json'}

        data = {
            "email": email,
            "password": password,
            "returnSecureToken": False
        }

        response = await asyncio.to_thread(requests.post, url=firebaseAuthURL, data=json.dumps(data), headers=headers)

        responseData = response.json()

        if response.status_code == 200:
            return responseData['localId']
        else:
            raise Exception('Invalid credentials.')