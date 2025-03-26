from flask import request, jsonify
from core import authenticaion_blueprint
from ..authentication.AccountManagement import AccountManagement
from ..authentication.data import User
from FirebaseConfig import auth

accountManagement: AccountManagement = AccountManagement()

@authenticaion_blueprint.route('/login', methods=['POST'])
async def login():
    '''
    API endpoint at /auth/login that authenticates a user

    Methods:
        POST
    
    Args:
        email (str): The email of the user being authenticated
        password (str): The password of the user being authenticated

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message",
            uid: "The authenticated users id"
        }
    '''

    data = request.get_json()

    email: str = data.get('email')
    password: str = data.get('password')

    try:
        uid: str = await accountManagement.login(email=email, password=password)

        response = jsonify({
            'success': True,
            'msg': 'User successfully authenticated!',
            'uid': uid
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

@authenticaion_blueprint.route('/account/edit', methods=['POST'])
async def editAccount():
    '''
    API endpoint at /auth/account/edit that edits an account

    Methods:
        POST
    
    Args:
        tocken (str): The authentication tocken of the client
        username (str): The new username of the user being editted
        email (str): The new email of the user being editted
        password (str): The new password of the user being editted
        phoneNumber (str): The new phone number of the user being editted

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message",
            username: The updated username,
            email: The updated email,
            phoneNumber: The updated phone number
        }
    '''

    data = request.get_json()
    token: str = data.get('token')
    username: str = data.get('username')
    email: str = data.get('email')
    password: str = data.get('password')
    phoneNumber: str = data.get('phoneNumber')

    try:
        updatedUser: User = await accountManagement.editAccount(
            token=token,
            username=username,
            email=email,
            password=password,
            phoneNumber=phoneNumber
        )

        response = jsonify({
            'success': True,
            'msg': 'Account successfully updated!',
            'username': updatedUser.username,
            'email': updatedUser.email,
            'phoneNumber': updatedUser.phoneNumber
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

        token = auth.create_custom_token(uid=user.userId)

        response = jsonify({
            "success": True,
            "msg": "Account created successfully!",
            "uid": user.userId,
            "token": token.decode("utf-8")
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
async def logout():
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
        loggedOut: bool = await accountManagement.logout(token=token)

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