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
            trim=data['trim'],
            mileage=data['mileage'],
            condition=data['condition'],
            accident_history=data['accident_history'],
            previous_owners=data['previous_owners'],
            image=data['image'],
            description=data['descritpion']
        )

    def __init__(
            self, 
            id: int, 
            make: str, 
            model: str, 
            year: int,
            trim: str,
            mileage: float,
            condition: str,
            accident_history: bool,
            previous_owners: int,
            image: str,
            description: str
        ):
        self.id = id
        self.make = make
        self.model = model
        self.year = year
        self.trim = trim
        self.mileage = mileage
        self.condition = condition
        self.accident_history = accident_history
        self.previous_owners = previous_owners
        self.image = image
        self.description = description

    def to_dict(self):
        return {
            'make': self.getMake(),
            'model': self.getModel(),
            'year': self.getYear(),
            'trim': self.getTrim(),
            'mileage': self.getMileage(),
            'condition': self.getCondition(),
            'accident_history': self.getAccidentHistory(),
            'previous_owners': self.getPreviousOwners(),
            'image': self.getImageSource(),
            'description': self.getDescription()
        }

    def getId(self) -> int:
        return self.id
    
    def getMake(self) -> str:
        return self.make
    
    def getModel(self) -> str:
        return self.model
    
    def getYear(self) -> int:
        return self.year
    
    def getTrim(self) -> int:
        return self.trim
    
    def getMileage(self) -> float:
        return self.mileage
    
    def getCondition(self) -> str:
        return self.condition
    
    def getAccidentHistory(self) -> bool:
        return self.accident_history
    
    def getPreviousOwners(self) -> int:
        return self.previous_owners
    
    def getImageSource(self) -> str:
        return self.image
    
    def getDescription(self) -> str:
        return self.description