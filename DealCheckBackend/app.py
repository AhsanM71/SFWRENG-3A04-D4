from flask import Flask
from flask_cors import CORS 
from core import authenticaion_blueprint, dealcheck_blueprint
from dotenv import load_dotenv


# Import firebase config so the firebase admin sdk is setup wherever imported.
import FirebaseConfig

if __name__ == '__main__':
    app = Flask(__name__)
    CORS(app)

    # Load environment variables from .env
    load_dotenv()

    app.register_blueprint(authenticaion_blueprint, url_prefix="/auth")
    app.register_blueprint(dealcheck_blueprint, url_prefix='/val')
    #app.register_blueprint(carreccomendation_blueprint, url_prefix='/reccomend')
    
    app.run(host='0.0.0.0',port=8001,debug=True)