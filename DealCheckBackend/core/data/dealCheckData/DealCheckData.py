from __future__ import annotations
from core.data import Car, FirestoreDatabaseEntity
from db import getDocumentRefPath, CARS_COLLECTION

class DealCheckData(FirestoreDatabaseEntity):
    @staticmethod
    def from_dict(data: dict) -> DealCheckData:
        return DealCheckData(
            id=data['id'],
            userID=data['userId'],
            price=data['price'],
            car=Car.from_dict(data['car']),
            prediction=data['prediction'],
            actual=data['actual']           
        )
    
    def __init__(self, id: str, userID: str, price: int, car: Car, prediction: str, actual: str):
        self.id = id
        self.userId = userID
        self.price = price
        self.car = car
        self.prediction = prediction
        self.actual = actual
    
    def to_dict(self):
        return {
            'userId': self.getUserId(),
            'price': self.getPrice(),
            'car': getDocumentRefPath(CARS_COLLECTION, self.car.getId()),
            'prediction': self.getPrediction(),
            'actual': self.getActual()
        }
    
    def getId(self) -> str:
        return self.id
    
    def getUserId(self) -> str:
        return self.userId
    
    def getPrice(self) -> int:
        return self.price
    
    def getCar(self) -> Car:
        return self.car
    
    def getImage(self) -> str:
        return self.car.getImageSource()
    
    def getDescription(self) -> str:
        return self.car.getDescription()
    
    def getPrediction(self) -> str:
        return self.prediction
    
    def getActual(self) -> str:
        return self.actual
        