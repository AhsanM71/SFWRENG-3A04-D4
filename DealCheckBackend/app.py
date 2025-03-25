from flask import Flask

import os
from flask_cors import CORS 


if __name__ == '__main__':
    app = Flask(__name__)
    CORS(app)

    app.run(host='0.0.0.0',port=8001,debug=True)