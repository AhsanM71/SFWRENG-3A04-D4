from __future__ import annotations
from firebase_admin.auth import UserRecord

class User:
    @staticmethod
    def fromUserRecord(record: UserRecord) -> User:
        '''
        Takes in firebase UserRecord object that contains user data and converts it to a User object

        Args:
            record (UserRecord): The firebase UserRecord object containing the user data

        Returns:
            User: The user object matching the provided UserRecord user data
        '''

        userId: str = record.uid
        email: str = record.email
        username: str = record.display_name
        phoneNumber: str = record.phone_number

        return User(
            userId=userId,
            username=username,
            email=email,
            phoneNumber=phoneNumber
        )

    def __init__(self, userId: str, username: str, email: str, phoneNumber: str):
        '''
        Instantiates a user object

        Args:
            userId (str): The if of the user in the firebase auth system
            username (str): The username of the user
            email (str): The email of the user
            phoneNumber (str): The user's phone number
        '''

        self.userId = userId
        self.username = username
        self.email = email
        self.phoneNumber = phoneNumber