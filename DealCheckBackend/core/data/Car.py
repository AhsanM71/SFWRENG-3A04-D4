class Car:
    def __init__(self, id: int, make: str, model: str, year: int, mileage: float):
        self.id = id
        self.make = make
        self.model = model
        self.year = year
        self.mileage = mileage

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