from FirebaseConfig import auth
import asyncio

class AccountLogout:
    async def logout(self, userId: str) -> bool:
        '''
        Logs out a user given their user ID by revoking their refresh tockens

        Args:
            userId: The id of the user to logout

        Returns:
            bool: True when the user was successfully logged out.
        '''

        if not userId:
            raise Exception('User ID is a required field.')
        
        await asyncio.to_thread(auth.revoke_refresh_tokens, uid=userId)
        return True