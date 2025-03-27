from ..data.User import User
import asyncio
from FirebaseConfig import auth

class RegistrationSystem:
    async def createAccount(self, username: str, email: str, password: str, phoneNumber: str) -> User:
        '''
        Creates a user in the firebase account management system

        Args:
            username (str): The username of the user being created
            email (str): The email of the user being created
            password (str): The password of the user being created
            phoneNumber (str): The new user's phone number

        Return:
            User: The User instance containing the new users data
        '''

        if not username or not email or not password or not phoneNumber:
            raise Exception('The arguments username, email, password, and phoneNumber are required')
        
        userData: dict = await asyncio.to_thread(
            auth.create_user,
            display_name=username,
            email=email,
            password=password,
            phone_number=phoneNumber
        )

        return User.fromUserRecord(userData)