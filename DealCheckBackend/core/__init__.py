from flask import Blueprint

authenticaion_blueprint = Blueprint('auth', __name__)
dealcheck_blueprint = Blueprint('val', __name__)
#carreccomendation_blueprint = Blueprint('reccomend', __name__)

from core.routes import AccountManagementRouter
from core.routes import DealCheckRouter
#from core.routes import CarReccomendationRouter