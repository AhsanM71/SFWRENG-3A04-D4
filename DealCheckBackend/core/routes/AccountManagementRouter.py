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
    
@authenticaion_blueprint.route('/account/retrieve', methods=['POST'])
async def retrieveAccount():
    '''
    API endpoint at /auth/account/retrieve that retrieves an accounts data

    Methods:
        POST
    
    Args:
        tocken (str): The authentication tocken of the client

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message",
            username: The username of the retrieved account,
            email: The email of the retrieved account,
            phoneNumber: The phone number of the retrieved account
        }
    '''

    data = request.get_json()
    token = data.get('token')

    try:
        user: User = await accountManagement.retrieveAccount(token=token)

        userData: dict = {
            'success': True,
            'username': user.username,
            'email': user.email,
            'phoneNumber': user.phoneNumber
        }

        response = jsonify(userData)
        response.status_code = 200

        return response
    except Exception as e:
        response = jsonify({
            "success": False,
            "msg": str(e)
        })
        response.status_code = 200
        return response
    
@authenticaion_blueprint.route('/logout', methods=['POST'])
def logout():
    '''
    API endpoint at /auth/logout that logs out a user given their authentication tocken

    Methods:
        POST
    
    Args:
        tocken (str): The authentication tocken of the client

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message"
        }
    '''

    data = request.get_json()
    token = data.get('token')

    try:
        loggedOut: bool = accountManagement.logout(token=token)

        response = jsonify({
            'success': loggedOut,
            'msg': 'User successfully logged out!'
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