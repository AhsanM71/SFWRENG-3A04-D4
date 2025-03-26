from ..data.User import User
from FirebaseConfig import auth
import asyncio

class EditAccount:
    async def editAccount(self, user: User, password: str) -> User:
        '''
        Edits a user in the firebase account management system

        Args:
            user (User): The user instance containing the new data of the user

        Return:
            User: The User instance containing the updated users data
        '''

        if not user:
            raise Exception('User instance is a required fields.')
        
        if not user.email:
            raise Exception('Invalid email address: {email}'.format(email=user.email))
        
        if not user.username:
            raise Exception('Invalid username: {username}'.format(username=user.username))
        
        if not password and password != 'N/A___INAPPLICABLE':
            raise Exception('Invalid password: {password}'.format(password=password))
        
        if not user.phoneNumber:
            raise Exception('Invalid phone number: {phoneNumber}'.format(phoneNumber=user.phoneNumber))
        
        updateData = {
            "email": user.email,
            "display_name": user.username,
            "phone_number": user.phoneNumber
        }

        if(password != 'N/A___INAPPLICABLE'):
            updateData['password'] = password
        
        await asyncio.to_thread(
            auth.update_user,
            uid=user.userId,
            **updateData
        )

        return user