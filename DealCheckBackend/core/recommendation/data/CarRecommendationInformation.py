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
            depricationCurveSrc=data['depricationCurveSrc']
        )

    def __init__(self, id: str, userId: str, description: str, carRecommendation: str, car: Car, depricationCurveSrc: str):
        self.id = id
        self.userId = userId
        self.description = description
        self.carRecommendation = carRecommendation
        self.car = car
        self.depricationCurveSrc = depricationCurveSrc

    def to_dict(self) -> dict:
        return {
            'userId': self.getUserId(),
            'description': self.getDescription(),
            'carRecommendation': self.getCarRecommendation(),
            'car': getDocumentReference(CARS_COLLECTION, self.car.getId()),
            'depricationCurveSrc': self.getDepricationCurveSrc()
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
    
    def getDepricationCurveSrc(self) -> str:
        return self.depricationCurveSrc