from flask import request, jsonify
from core import dealcheck_blueprint
from core.dealCheck.blackboard.DealCheckBlackBoard import DealCheckBlackBoard
from core.dealCheck.data.DealCheckDAO import DealCheckDAO
from core.dealCheck.data.DealCheckData import DealCheckData
from core.data.car.CarDAO import CarDAO
from core.data.car.Car import Car
import asyncio
from firebase_admin import auth

dealCheckDAO: DealCheckDAO = DealCheckDAO()
dealCheckBlackBoard: DealCheckBlackBoard = DealCheckBlackBoard(dealCheckDAO)

@dealcheck_blueprint.route('/dealCheck', methods=['POST'])
async def requestDealCheck():
    data: dict = request.get_json().get('data')
    
    user_id: dict = data.get('user_id')
    token = user_id.get('id')
    
    car_details: dict = data.get('car_details')
    make: str = car_details.get('make', 'Unknown')
    model: str = car_details.get('model', 'Unknown')
    year: int = car_details.get('year', 0)
    trim: str = car_details.get('trim', 'Unknown')
    mileage: int = car_details.get('mileage', 0)
    condition: str = car_details.get('condition', 'Unknown')
    accident_history: bool = car_details.get('accident_history', False)
    previous_owners: int = car_details.get('previous_owners', 0)
    image: str = car_details.get('image', '')
    description: str = car_details.get('description', '')
    
    pricing: dict = data.get('pricing')
    
    if pricing:
        price: int = pricing.get('listed_price')
    else:
        price: int = 0
    
    seller_info: dict = data.get('seller_info')
    
    if seller_info:
        seller_type: str = seller_info.get('seller_type')
        warranty: str = seller_info.get('warranty')
        inspection_completed: bool = seller_info.get('inspection_completed')
    else:
        seller_type: str = 'Unknown'
        warranty: str = 'Unknown'
        inspection_completed: bool = False
    
    additional_info: dict = data.get('additional_info')
    if additional_info:
        fuel_efficiency_mpg: int = additional_info.get('fuel_efficiency_mpg')
        insurance_estimate: int = additional_info.get('insurance_estimate')
        resale_value: int = additional_info.get('resale_value')
    else:
        fuel_efficiency_mpg: int = 0
        insurance_estimate: int = 0
        resale_value: int = 0
    
    answers: dict = data.get('answers')
    if answers:
        prediction: str = answers.get('predicted')
        actual: str = answers.get('actual')
        confidence: float = answers.get('confidence')
    else:
        actual: str = ''
        confidence: float = 0.0
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
        
        decoded_tocken = await asyncio.to_thread(auth.verify_id_token, id_token=token)
        uID = decoded_tocken['uid']
        
        tempDealCheckData: DealCheckData = DealCheckData(
            id=None,
            userID=uID,
            price=price,
            car=car,
            seller_type=seller_type,
            warranty=warranty,
            inspection_completed=inspection_completed,
            fuel_efficiency_mpg=fuel_efficiency_mpg,
            insurance_estimate=insurance_estimate,
            resale_value=resale_value,
            prediction=prediction,
            actual=actual,
            confidence=confidence
        )
        
        expertOuput: DealCheckData = await dealCheckBlackBoard.handleRequest(tempDealCheckData)
        
        dealCheckData: DealCheckData = await dealCheckDAO.addDealCheckData(expertOuput)
        response = jsonify({
            'success': True,
            'msg': 'DealCheck Valuation successful!',
            'user_id': {
              'id': dealCheckData.getUserId()  
            },
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

# @dealcheck_blueprint.route('/dealCheck/retrieve', methods=['POST'])
# async def getDealCheck():
#     data = request.get_json()
    