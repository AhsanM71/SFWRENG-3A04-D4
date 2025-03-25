from core.authentication.actions.RegistrationSystem import RegistrationSystem
from core.authentication.data.User import User
 
class AccountManagement:
    def __init__(self):
        self.registrationSystem = RegistrationSystem()

    async def createAccount(self, username: str, email: str, password: str, phoneNumber: str) -> User:
        ''' Creates a new user, delegates to RegistrationSystem '''

        return await self.registrationSystem.createAccount(
            username=username,
            email=email,
            password=password,
            phoneNumber=phoneNumber
        )