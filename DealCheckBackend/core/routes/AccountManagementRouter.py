from flask import request, jsonify
from core import authenticaion_blueprint
from ..authentication.AccountManagement import AccountManagement
from ..authentication.data import User

accountManagement: AccountManagement = AccountManagement()

@authenticaion_blueprint.route('/signup', methods=['POST'])
async def createAccount():
    '''
    API endpoint at /auth/signup that creates a new account

    Methods:
        POST
    
    Args:
        username (str): The username of the new user being created
        email (str): The email of the new user being created
        password (str): The password of the new user being created
        phoneNumber (str): The phone number of the new user being created

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message",
            uid: The new users id if the user has successfully been created
        }
    '''

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    phoneNumber = data.get('phoneNumber')

    print(username)
    print(email)
    print(password)
    print(phoneNumber)

    try:
        user: User = await accountManagement.createAccount(
            username=username,
            email=email,
            password=password,
            phoneNumber=phoneNumber
        )

        response = jsonify({
            "success": True,
            "msg": "Account created successfully!",
            "uid": user.userId
        })
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify({
            "success": False,
            "msg": str(e)
        })
        response.status_code = 200
        return response