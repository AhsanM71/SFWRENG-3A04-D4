from FirebaseConfig import auth
import asyncio

class AccountLogin:
    async def login(self, token: str) -> str:
        '''
        Authenticates a user given the authentication token

        Args:
            token (str): The auth token of the user being authenticated

        Returns:
            str: The user id of the authenticated user. NA otherwise.
        '''

        if not token:
            raise Exception('Token is a required field!')
        
        decoded_tocken = await asyncio.to_thread(auth.verify_id_token, token=token)
        
        if 'uid' in decoded_tocken:
            uid = decoded_tocken['uid']
            return uid