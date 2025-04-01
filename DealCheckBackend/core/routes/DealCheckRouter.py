from flask import request, jsonify
from core import dealcheck_blueprint
from ..dealCheck.blackboard import DealCheckBlackBoard
from ..dealCheck.data import DealCheckDAO, DealCheckData
from ..data.car import CarDAO, Car
import asyncio
from firebase_admin import auth

dealCheckDAO: DealCheckDAO = DealCheckDAO()
dealCheckBlackBoard: DealCheckBlackBoard = DealCheckBlackBoard(dealCheckDAO)

@dealcheck_blueprint.route('/dealCheck', methods=['POST'])
async def requestDealCheck():
    data = request.get_json()
    
    token = request.headers.get('Authorization')
    if token and token.startswith("Bearer "):
        token = token.split(" ")[1] 
    else:
        return jsonify({"success": False, "msg": "Authorization token is missing!"}), 401

    try:
        decoded_token = await asyncio.to_thread(auth.verify_id_token, id_token=token)
        user_id = decoded_token['uid']
    except Exception as e:
        return jsonify({"success": False, "msg": "Invalid or expired token!"}), 401

    car_details: dict = data.get('car_details')
    make: str = car_details.get('make')
    model: str = car_details.get('model')
    year: int = car_details.get('year')
    trim: str = car_details.get('trim')
    mileage: int = car_details.get('mileage')
    condition: str = car_details.get('condition')
    accident_history: bool = car_details.get('accident_history')
    previous_owners: int = car_details.get('previous_owners')
    image: str = car_details.get('image')
    description: str = car_details.get('description')
    
    pricing: dict = data.get('pricing')
    price: int = pricing.get('price')
    
    seller_info: dict = data.get('seller_info')
    seller_type: str = seller_info.get('seller_type')
    warranty: str = seller_info.get('warranty')
    inspection_completed: bool = seller_info.get('inspection_completed')
    
    additional_info: dict = data.get('additional_info')
    fuel_efficiency_mpg: int = additional_info.get('fuel_efficiency_mpg')
    insurance_estimate: int = additional_info.get('insurance_estimate')
    resale_value: int = additional_info.get('resale_value')
    
    answers: dict = data.get('answers')
    prediction: str = answers.get('prediction')
    actual: str = answers.get('actual')
    
    try:
        tempCar: Car = Car(
            id=None,
            make=make,
            model=model,
            year=year,
            trim=trim,
            mileage=mileage,
            condition=condition,
            accident_history=accident_history,
            previous_owners=previous_owners,
            image=image,
            description=description
        )
        
        car: Car = await CarDAO.addCar(tempCar) 

        tempDealCheckData: DealCheckData = DealCheckData(
            id=None,
            userID=user_id,
            price=price,
            car=car,
            seller_type=seller_type,
            warranty=warranty,
            inspection_completed=inspection_completed,
            fuel_efficiency_mpg=fuel_efficiency_mpg,
            insurance_estimate=insurance_estimate,
            resale_value=resale_value,
            prediction=prediction,
            actual=actual
        )
        
        expertOuput: DealCheckData = dealCheckBlackBoard.handleRequest(tempDealCheckData)
        dealCheckData: DealCheckData = await dealCheckDAO.addDealCheckData(expertOuput)

        response = jsonify({
            'success': True,
            'msg': 'DealCheck Valuation successful!',
            'car_details': {
                'make': car.getMake(),
                'model': car.getModel(),
                'year': car.getYear(),
                'trim': car.getTrim(),
                'mileage': car.getMileage(),
                'condition': car.getCondition(),
                'accident_history': car.getAccidentHistory(),
                'previous_owners': car.getPreviousOwners(),
                'image': car.getImageSource(),
                'description': car.getDescription()
            },
            'pricing': {
                'price': dealCheckData.getPrice()
            },
            'seller_info': {
                'seller_type': dealCheckData.getSellerType(),
                'warranty': dealCheckData.getWarranty(),
                'inspection_completed': dealCheckData.getInspectionCompleted()
            },
            'additonal_info': {
                'fuel_efficiency_mpg': dealCheckData.getfuelEfficiencyMpg(),
                'insurance_estimate': dealCheckData.getInsuranceEstimate(),
                'resale_value': dealCheckData.getResaleValue()
            },
            'answers': {
                'prediction': dealCheckData.getPrediction(),
                'actual': dealCheckData.getActual(),
                'confidence': dealCheckData.getConfidence()
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

@dealcheck_blueprint.route('/dealCheck/retrieve', methods=['POST'])
async def getDealCheck():
    data = request.get_json()
    