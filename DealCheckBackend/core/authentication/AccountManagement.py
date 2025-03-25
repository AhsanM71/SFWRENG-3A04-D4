from core.authentication.actions.RegistrationSystem import RegistrationSystem
from core.authentication.actions.AccountRetriever import AccountRetriever
from core.authentication.data.User import User
from FirebaseConfig import auth
import asyncio
 
class AccountManagement:
    def __init__(self):
        self.registrationSystem = RegistrationSystem()
        self.accountRetriever = AccountRetriever()

    async def createAccount(self, username: str, email: str, password: str, phoneNumber: str) -> User:
        ''' Creates a new user, delegates to RegistrationSystem '''

        return await self.registrationSystem.createAccount(
            username=username,
            email=email,
            password=password,
            phoneNumber=phoneNumber
        )
    
    async def retrieveAccount(self, token: str) -> User:
        ''' Retrieves the account data for the owner of the provided auth token, delegates data retrieval to AccountRetriever '''

        if not token:
            raise Exception('Authentication token required!')
        
        decoded_tocken = await asyncio.to_thread(auth.verify_id_token, id_token=token)
        uid = decoded_tocken['uid']

        if not uid:
            raise Exception('Unable to verify user with the provided credentials!')
        
        return await self.accountRetriever.retrieveAccount(userId=uid)