from flask import Flask
from flask_cors import CORS 

# Import firebase config so the firebase admin sdk is setup wherever imported.
import FirebaseConfig

if __name__ == '__main__':
    app = Flask(__name__)
    CORS(app)

    app.run(host='0.0.0.0',port=8001,debug=True)