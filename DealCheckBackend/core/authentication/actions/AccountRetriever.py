from ..data.User import User
from firebase_admin.auth import UserRecord
from FirebaseConfig import auth
import asyncio

class AccountRetriever:
    async def retrieveAccount(self, userId: str) -> User:
        '''
        Gets an account provided a userId

        Args:
            userId: The id of the user to retrieve

        Return:
            User: The User instance containing the retrieved users data
        '''

        if not userId:
            raise Exception('The users ID is a required field!')
        
        userData: UserRecord = await asyncio.to_thread(auth.get_user, uid=userId)

        return User.fromUserRecord(userData)