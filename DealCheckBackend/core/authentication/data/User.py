class User:
    @staticmethod
    def fromJSON(jsonData: dict) -> User:
        '''
        Takes in firebase JSON object that contains user data and converts it to a User object

        Args:
            jsonData (dict): The firebase JSON object containing the user data

        Returns:
            User: The user object matching the provided JSON user data
        '''

        userId: str = jsonData['uid']
        email: str = jsonData['email']
        username: str = jsonData['displayName']
        phoneNumber: str = jsonData['phoneNumber']

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
        self.userName = username
        self.email = email
        self.phoneNumber = phoneNumber