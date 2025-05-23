from __future__ import annotations
from core.data import Car, FirestoreDatabaseEntity
from db import getDocumentReference, CARS_COLLECTION

class DealCheckData(FirestoreDatabaseEntity):
    @staticmethod
    def from_dict(data: dict) -> DealCheckData:
        return DealCheckData(
            id=data['id'],
            userID=data['userId'],
            price=data['listed_price'],
            car=Car.from_dict(data['car']),
            seller_type=data['seller_type'],
            warranty=data['warranty'],
            inspection_completed=data['inspection_completed'],
            fuel_efficiency_mpg=data['fuel_efficiency_mpg'],
            insurance_estimate=data['insurance_estimate'],
            resale_value=data['resale_value'],
            prediction=data['predicted'],
            actual=data['actual'],
            rationale=data['rationale'],
            confidence=data['confidence'],
            expertUsed=data['expert_used']      
        )
    
    def __init__(self, id: str, userID: str, price: int, car: Car, seller_type: str, warranty: str, inspection_completed: bool, 
                 fuel_efficiency_mpg: str, insurance_estimate: str, resale_value: str, prediction: str, actual: str, rationale: str, 
                 confidence: float, expertUsed: str):
        self.id = id
        self.userId = userID
        self.price = price
        self.car = car
        self.seller_type = seller_type
        self.warranty = warranty
        self.inspection_completed = inspection_completed
        self.fuel_efficiency_mpg = fuel_efficiency_mpg
        self.insurance_estimate = insurance_estimate
        self.resale_value = resale_value
        self.prediction = prediction
        self.actual = actual
        self.rationale = rationale
        self.confidence = confidence
        self.expertUsed = expertUsed
    
    def to_dict(self):
        return {
            'userId': self.getUserId(),
            'listed_price': self.getPrice(),
            'car': getDocumentReference(CARS_COLLECTION, self.car.getId()),
            'seller_type': self.getSellerType(),
            'warranty': self.getWarranty(),
            'inspection_completed': self.getInspectionCompleted(),
            'fuel_efficiency_mpg': self.getfuelEfficiencyMpg(),
            'insurance_estimate': self.getInsuranceEstimate(),
            'resale_value': self.getResaleValue(),
            'predicted': self.getPrediction(),
            'actual': self.getActual(),
            'rationale': self.getRationale(),
            'confidence': self.getConfidence(),
            'expert_used': self.getExpertUsed()
        }
    
    def getId(self) -> str:
        return self.id
    
    def getUserId(self) -> str:
        return self.userId
    
    def getPrice(self) -> int:
        return self.price
    
    def getCar(self) -> Car:
        return self.car
    
    def getSellerType(self) -> str:
        return self.seller_type
    
    def getWarranty(self) -> str:
        return self.warranty
    
    def getInspectionCompleted(self) -> bool:
        return self.inspection_completed
    
    def getfuelEfficiencyMpg(self) -> str:
        return self.fuel_efficiency_mpg
    
    def getInsuranceEstimate(self) -> str:
        return self.insurance_estimate
    
    def getResaleValue(self) -> str:
        return self.resale_value
    
    def getImage(self) -> str:
        return self.car.getImageSource()
    
    def getDescription(self) -> str:
        return self.car.getDescription()
    
    def getPrediction(self) -> str:
        return self.prediction
    
    def getActual(self) -> str:
        return self.actual
    
    def getRationale(self) -> str:
        return self.rationale
    
    def setRationale(self, rationale: str):
        self.rationale = rationale
    
    def getConfidence(self) -> float:
        return self.confidence
    
    def setActual(self, actual: str):
        self.actual = actual
        
    def setConfidence(self, confidence: float):
        self.confidence = confidence
    
    def getExpertUsed(self) -> str:
        return self.expertUsed

    def setExpertUsed(self, expertUsed: str):
        self.expertUsed = expertUsed