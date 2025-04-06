from flask import request, jsonify
from core import carrecommendation_blueprint
from core.recommendation.blackboard.CarRecommendationBlackBoard import CarRecommendationBlackBoard
from core.recommendation.data.CarRecommendationInformationDAO import CarRecommendationInformationDAO
from core.recommendation.data.CarRecommendationInformation import CarRecommendationInformation
from core.ai import CarImgGeneratorAI
from core.data.car.CarDAO import CarDAO
from core.data.car.Car import Car

carRecommendDAO: CarRecommendationInformationDAO = CarRecommendationInformationDAO()
carRecommendBlackBoard: CarRecommendationBlackBoard = CarRecommendationBlackBoard(carRecommendDAO)

@carrecommendation_blueprint.route('/carRecommendation', methods=['POST'])
async def requestCarRecommendation():
    '''
    API endpoint at /rec/carRecommendation that performs car recommendations

    Methods:
        POST
    
    Args:
        data (dict): The user inputted information about their preferences for car recommendations

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message",
            'user_id': {
              'id': "Id of the user putting in the request" 
            },
            'description': {
                'user_preferences': "User preferences for the car"
            },
            'answers': {
                'recommendation_info': "Recommended car details",
                'pros': "Pros of the recommendation",
                'cons': "Cons of the recommendation"
            }
        }
    '''
    data: dict = request.get_json()
    
    user_id: dict = data.get('user_id')
    uID = user_id.get('id')
    description: dict = data.get('description')
    user_preferences = description.get('user_preferences')

    try:
        tempRecommendationInfo: CarRecommendationInformation = CarRecommendationInformation(
            id=None,
            userId=uID,
            description=user_preferences,
            carRecommendation=None,
            car=None,
            depricationCurveImg=None,
            price=None,
            pros=None,
            cons=None
        )
        
        expertOutput: CarRecommendationInformation = await carRecommendBlackBoard.handleRequest(tempRecommendationInfo)
        
        recommendationData: CarRecommendationInformation = carRecommendDAO.addCarRecommendationInformation(expertOutput)
        
        if recommendationData.getCar().getImageSource() is None:
            image: str = await CarImgGeneratorAI.generateCarImg(recommendationData.getCar())
            recommendationData.getCar().setImage(image)
            
        response = jsonify({
            'success': True,
            'msg': 'Car Recommendation successful!',
            'user_id': {
              'id': recommendationData.getUserId()  
            },
            'description': {
                'user_preferences': recommendationData.getDescription()
            },
            'recommendation': {
                'price': recommendationData.getPrice(),
                'make': recommendationData.getCar().getMake(),
                'model': recommendationData.getCar().getModel(),
                'year': recommendationData.getCar().getYear(),
                'trim': recommendationData.getCar().getTrim(),
                'mileage': recommendationData.getCar().getMileage(),
                'condition': recommendationData.getCar().getCondition(),
                'accident_history': recommendationData.getCar().getAccidentHistory(),
                'previous_owners': recommendationData.getCar().getPreviousOwners(),
                'image': recommendationData.getCar().getImageSource(),
                'description': recommendationData.getCar().getDescription(),
                'pros': recommendationData.getPros(),
                'cons': recommendationData.getCons(),
                'overall_description': recommendationData.getCarRecommendation(),
                'depreciationCurveSrc': recommendationData.getDepricationCurveImg()
            }
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

@carrecommendation_blueprint.route('/carRecommendation/retrieve', methods=['POST'])
async def getCarRecommendation():
    '''
    API endpoint at /rec/carRecommendation/retrieve that retrieves car recommendation data based on id

    Methods:
        POST
    
    Args:
        data (dict): The user inputted information about the car recommendation they want (required recommendation_id field)

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message",
            'budget': {
                'price': Budget for the car
            },
            'primary_purpose': {
                'purpose': "Purpose of the car (e.g., commuting, family, etc.)"
            },
            'additional_preferences': {
                'preferences': "Additional preferences for the car"
            },
            'answers': {
                'recommendation_info': "Recommended car details",
                'pros': "Pros of the recommendation",
                'cons': "Cons of the recommendation"
            }
        }
    '''
    data: dict = request.get_json()
    recommendation_id: str = data.get("recommendation_id")
    
    try:
        recommendationData: CarRecommendationInformation = carRecommendDAO.getCarRecommendationInformation(id=recommendation_id)
        response = jsonify({
            'success': True,
            'msg': 'Car Recommendation successful!',
            'user_id': {
              'id': recommendationData.getUserId()  
            },
            'description': {
                'user_preferences': recommendationData.getDescription()
            },
            'answers': {
                'recommendation_info': recommendationData.getRecommendationInfo(),
                #'pros': recommendationData.getPros(),
                #'cons': recommendationData.getCons()
            }
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
    
@carrecommendation_blueprint.route('/carRecommendation/user', methods=['POST'])
async def getUserDealChecks():
    '''
    API endpoint at /rec/carRecommendation/user that retrieves all recommendations for a given user ID

    Methods:
        POST

    Args:
        data (dict): The request must contain the user_id field:
            "user_id": {
                "id": "some_user_id"
            }

    Returns:
        JSON: 
        {
            success: True/False,
            msg: "Success/Error message",
            car_recommendations: [List of car recommendation JSONs like from retrieve]
        }
    '''
    data: dict = request.get_json()
    user_id: str = data.get("user_id")
    if not user_id:
        return jsonify({"success": False, "msg": "user_id is required"}), 400

    try:
        carRecs: list[CarRecommendationInformation] = carRecommendDAO.getUserCarRecommendationInformation(userId=user_id)
        carRecList = []
        for carRecData in carRecs:
            car: Car = carRecData.getCar()
            carRecList.append({
                'user_id': {
                    'id': carRecData.getUserId()  
                },
                'carInfo': {
                    'id': car.getId(),
                    'make': car.getMake(),
                    'model': car.getModel(),
                    'year': car.getYear(),
                    'price': carRecData.getPrice(),
                    'description': car.getDescription(),
                    'imgSrc': car.getImageSource()
                },
                'description': {
                    'user_preferences': carRecData.getDescription()
                },
                'answers': {
                    'recommendation_info': carRecData.getCarRecommendation(),
                    'pros': carRecData.getPros(),
                    'cons': carRecData.getCons()
                },
                'depreciation_info': {
                    'curveImg': carRecData.getDepricationCurveImg()
                }
            })
        return jsonify({
            'success': True,
            'msg': f'Found {len(carRecList)} recommendations for user {user_id}',
            'recommendations': carRecList
        }), 200

    except Exception as e:
        response = jsonify({
            "success": False,
            "msg": str(e)
        })
        response.status_code = 200
        return response

@carrecommendation_blueprint.route('/carRecommendation/curve', methods=['POST'])
async def requestCarDepreciationCurve():
    '''
    API endpoint at /rec/carRecommendation/curve that returns car recommendation curves

    Methods:
        POST
    
    Args:
        data (dict): The user inputted information regarding the vehicle

    Return:
        JSON: 
        {
            success: True/False,
            msg: "Error/Success Message",
            'user_id': {
              'id': "Id of the user putting in the request" 
            },
            'description': {
                'user_preferences': "User preferences for the car"
            },
            'answers': {
                'recommendation_info': "Recommended car details",
                'pros': "Pros of the recommendation",
                'cons': "Cons of the recommendation"
            }
        }
    '''
    data: dict = request.get_json()
    
    user_id: dict = data.get('user_id')
    uID = user_id.get('id')
    description: dict = data.get('car')
    year = description.get('year')
    model = description.get('model')
    make = description.get('make')
    price = description.get('price')

    try:
        
        image: str = await CarImgGeneratorAI.generateDepricationCurve(year,make,model,price)
            
        response = jsonify({
            'success': True,
            'msg': 'Car Recommendation successful!',
            'user_id': {
              'id': uID
            },
            'car': {
                'make': make,
                'model': model,
                'year': year,
                'price': price
            },
            'depreciation': {
                'depreciationCurveSrc': image
            }
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