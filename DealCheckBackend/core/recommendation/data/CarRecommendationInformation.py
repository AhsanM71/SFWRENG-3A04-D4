from core.data import Car

class CarRecommendationInformation:
    def __init__(self, id: str, userId: str, description: str, carRecommendation: str, car: Car, depricationCurveSrc: str):
        self.id = id
        self.userId = userId
        self.description = description
        self.carRecommendation = carRecommendation
        self.car = car
        self.depricationCurveSrc = depricationCurveSrc

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