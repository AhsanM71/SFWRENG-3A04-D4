from flask import Blueprint

authenticaion_blueprint = Blueprint('auth', __name__)
dealcheck_blueprint = Blueprint('val', __name__)
carrecommendation_blueprint = Blueprint('recommend', __name__)

from core.routes import AccountManagementRouter
from core.routes import DealCheckRouter
from core.routes import CarRecommendationRouter