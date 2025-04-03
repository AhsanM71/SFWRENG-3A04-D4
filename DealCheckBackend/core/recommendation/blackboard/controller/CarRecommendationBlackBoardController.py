from core.blackboard import BlackBoardController, Expert
from data.CarRecommendationInformation import CarRecommendationInformation

class CarRecommendationBlackBoardController(BlackBoardController[CarRecommendationInformation]):
    def __init__(self, carRecommendationExpert: Expert[CarRecommendationInformation]):
        super().__init__()
        self.carRecommendationExpert: Expert[CarRecommendationInformation] = carRecommendationExpert
    
    async def handleRequest(self, request: CarRecommendationInformation) -> CarRecommendationInformation:
        data: CarRecommendationInformation = await self.carRecommendationExpert.evaluateRequest(request=request)
        return data