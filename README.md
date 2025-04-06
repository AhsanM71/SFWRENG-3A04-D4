# DealCheck - Car Deal Valuation Application

## About DealCheck

DealCheck is an advanced car valuation and recommendation platform designed to help users make informed vehicle purchasing decisions. Our application leverages multiple expert systems to analyze car deals, provide personalized vehicle recommendations, and visualize long-term value through depreciation curves. Whether you're a first-time buyer or a seasoned car enthusiast, DealCheck empowers you with data-driven insights to ensure you get the best deal possible.

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Flask (Python)
- **Database**: Firestore Database (NoSQL)
- **Authentication**: Firebase Authentication with JWT tokens
- **AI/ML**: Vertex AI, Google Generative AI (Gemini models)
- **Image Generation**: Vertex AI Imagen for car visualizations
- **Containerization**: Docker

## Features

### Deal Valuation

Submit your car deal details and receive comprehensive valuation from our three expert systems:

- **Point System Expert**: Uses a weighted scoring algorithm to evaluate deals based on various factors like year, mileage, condition, and accident history. Each factor contributes to an overall score that determines if a deal is recommended.

- **Redbook API Expert**: Compares your potential purchase against a database of similar vehicles to determine if the pricing is competitive in the current market. Evaluates based on matching attributes like make, model, year, and specifications.

- **AI Expert**: Utilizes advanced AI models to analyze all aspects of the deal including vehicle images, combining market knowledge with visual inspection to provide human-like judgment on the deal quality.

### Car Recommendations

Our intelligent recommendation system analyzes your preferences, budget, and needs to suggest vehicles that best match your requirements. The system provides:

- Personalized vehicle suggestions based on your specific input
- Detailed pros and cons for each recommended vehicle
- Comprehensive rationale explaining why each vehicle matches your needs

### Depreciation Curve Visualization

Understand how your vehicle's value will change over time with our interactive depreciation curves:

- Visual representation of value retention over 5+ years
- Customized curves based on make, model, and vehicle specifics
- Compare depreciation rates between different vehicles to make long-term financial decisions

### User Authentication

Secure user management system that allows you to:

- Create and manage your account
- Save your preferences and previous valuations
- Access your history and recommendations across devices

## Running the Application

### Setting Up the Backend (Manual Setup)

1. Navigate to the backend directory:

```bash
cd DealCheckBackend
```

2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file using the template below:

```
MONGODB_URI=mongodb://localhost:27017/dealcheck
JWT_SECRET_KEY=your_secure_jwt_secret_key
LOCAL_PROJECT_PATH=.
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_APP_ID=your_firebase_app_id
```

4. Run the Flask application:

```bash
python app.py
```

The backend server will start running on port 8001.

### Running the Backend with Docker

To run the backend using Docker, you need to be in the DealCheckBackend directory.
Set the `LOCAL_PROJECT_PATH` environment variable in the `.env` to `.` to symbolize the location of the code on the local machine.

```bash
cd DealCheckBackend
docker compose up --build
```

Running the command above will build the docker image and run the container. When changing the backend code, you don't need to rebuild the image, changes will be detected automatically by Flask (like running and developing it on your local machine).

### Setting Up the Frontend

1. Navigate to the frontend directory:

```bash
cd DealCheckFrontend
```

2. Install the required dependencies:

```bash
npm install
```

3. Create a `.env` file using the template below:

```
EXPO_PUBLIC_API_KEY=your_firebase_api_key
EXPO_PUBLIC_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_APP_ID=your_firebase_app_id
EXPO_PUBLIC_API_URL=http://localhost:8001
```

4. Start the React Native application:

```bash
npx expo start
```

5. Use the Expo Go app on your mobile device to scan the QR code, or press 'a' to run on an Android emulator or 'i' for iOS simulator.

## Why We Created DealCheck

We developed DealCheck to address a critical gap in the car buying process: the lack of comprehensive, unbiased analysis tools available to everyday consumers. Car dealerships and professional buyers have access to sophisticated tools and insider knowledge to assess vehicle values, but individual buyers often rely on gut feeling or limited information.

DealCheck democratizes access to expert-level car valuation by combining multiple evaluation systems, machine learning, and market data into a user-friendly application that anyone can use. Our goal is to level the playing field and ensure that every car buyer can make confident, well-informed decisions based on reliable data and expert analysis.
