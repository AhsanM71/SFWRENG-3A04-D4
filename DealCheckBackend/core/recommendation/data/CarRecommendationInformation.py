from __future__ import annotations
from core.data import Car, FirestoreDatabaseEntity
from db import getDocumentReference, CARS_COLLECTION

class CarRecommendationInformation(FirestoreDatabaseEntity):
    @staticmethod
    def from_dict(data: dict) -> CarRecommendationInformation:
        return CarRecommendationInformation(
            id=data['id'],
            userId=data['userId'],
            description=data['description'],
            carRecommendation=data['carRecommendation'],
            car=Car.from_dict(data['car']),
            depricationCurveImg=data['depricationCurveImg'],
            price=data['price'],
            pros=data['pros'],
            cons=data['cons']
        )

    def __init__(self, id: str, userId: str, description: str, carRecommendation: str, car: Car, depricationCurveImg: str, price: int, pros: list[str], cons: list[str]):
        self.id = id
        self.userId = userId
        self.description = description
        self.carRecommendation = carRecommendation
        self.car = car
        self.depricationCurveImg = depricationCurveImg
        self.price = price
        self.pros = pros
        self.cons = cons

    def to_dict(self) -> dict:
        return {
            'userId': self.getUserId(),
            'description': self.getDescription(),
            'carRecommendation': self.getCarRecommendation(),
            'car': getDocumentReference(CARS_COLLECTION, self.car.getId()),
            'depricationCurveImg': self.getDepricationCurveImg(),
            'price': self.getPrice(),
            'pros': self.getPros(),
            'cons':self.getCons()
        }

    def getId(self) -> str:
        return self.id
    
    def getUserId(self) -> str:
        return self.userId
    
    def getDescription(self) -> str:
        return self.description
    
    def getCarRecommendation(self) -> str:
        return self.carRecommendation
    
    def getCar(self) -> str:
        return self.car
    
    def getDepricationCurveImg(self) -> str:
        return self.depricationCurveImg
    
    def getPrice(self) -> int:
        return self.car.getPrice()
    
    def getPros(self) -> list[str]:
        self.pros
        
    def getCons(self) -> list[str]:
        self.cons
    
    def setDepricationCurveImg(self, depricationCurveImg: str):
        self.depricationCurveImg = depricationCurveImg
    
    def setPros(self, pros: list[str]):
        self.pros = pros
    
    def setCons(self, cons: list[str]):
        self.cons = cons
    
    def setCarRecommendation(self, carRecommendation: str):
        self.carRecommendation = carRecommendation
    
    def setCar(self, car: Car):
        self.car = car
    
    def setPrice(self, price: int):
        self.price = price