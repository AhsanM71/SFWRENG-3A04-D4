from core.authentication.actions.AccountLogin import AccountLogin
from core.authentication.actions.EditAccount import EditAccount
from core.authentication.actions.AccountLogout import AccountLogout
from core.authentication.actions.RegistrationSystem import RegistrationSystem
from core.authentication.actions.AccountRetriever import AccountRetriever
from core.authentication.data.User import User
from FirebaseConfig import auth
import asyncio
 
class AccountManagement:
    def __init__(self):
        self.accountLogin = AccountLogin()
        self.editAccount = EditAccount()
        self.accountLogout = AccountLogout()
        self.registrationSystem = RegistrationSystem()
        self.accountRetriever = AccountRetriever()

    async def login(self, token: str):
        ''' Authenticates a user, delegates to AccountLogin '''

        return await self.accountLogin.login(token=token)

    async def editAccount(self, token: str, username: str, password: str, email: str, phoneNumber: str) -> User:
        ''' Edits the owner of the provided auth token, delegates editting logic to EditAccount '''

        if not token or not username or not password or not email or not phoneNumber:
            raise Exception('Token, username, password, email, and phone number fields are mandatory!')
        
        decoded_tocken = await asyncio.to_thread(auth.verify_id_token, id_token=token)
        uid = decoded_tocken['uid']

        user: User = User(
            userId=uid,
            username=username,
            email=email,
            phoneNumber=phoneNumber
        )

        updatedUser: User = await self.editAccount.editAccount(
            user=user,
            password=password
        )

        return updatedUser

    async def logout(self, token: str) -> bool:
        ''' Logs out the owner of the provided auth token, delegates logout to AccountLogout '''

        if not token:
            raise Exception('Authentication token required!')
        
        decoded_tocken = await asyncio.to_thread(auth.verify_id_token, id_token=token)
        uid = decoded_tocken['uid']

        return self.accountLogout.logout(userId=uid)

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