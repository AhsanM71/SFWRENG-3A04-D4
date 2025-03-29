from __future__ import annotations
from data import FirestoreDatabaseEntity

class Car(FirestoreDatabaseEntity):
    @staticmethod
    def from_dict(data: dict) -> Car:
        return Car(
            id=data['id'],
            make=data['make'],
            model=data['model'],
            year=data['year'],
            mileage=data['mileage']
        )

    def __init__(self, id: int, make: str, model: str, year: int, mileage: float):
        self.id = id
        self.make = make
        self.model = model
        self.year = year
        self.mileage = mileage

    def to_dict(self):
        return {
            'make': self.getMake(),
            'model': self.getModel(),
            'year': self.getYear(),
            'mileage': self.getMileage()
        }

    def getId(self) -> int:
        return self.id
    
    def getMake(self) -> str:
        return self.make
    
    def getModel(self) -> str:
        return self.model
    
    def getYear(self) -> int:
        return self.year
    
    def getMileage(self) -> float:
        return self.mileage