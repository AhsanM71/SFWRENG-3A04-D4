from flask import Flask
from flask_cors import CORS 
from core import authenticaion_blueprint

# Import firebase config so the firebase admin sdk is setup wherever imported.
import FirebaseConfig

if __name__ == '__main__':
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(authenticaion_blueprint, url_prefix="/auth")

    app.run(host='0.0.0.0',port=8001,debug=True)