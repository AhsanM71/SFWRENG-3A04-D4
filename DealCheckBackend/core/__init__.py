from flask import Blueprint

authenticaion_blueprint = Blueprint('auth', __name__)

from core.routes import AccountManagementRouter