from core.blackboard import BlackBoard, BlackBoardController, Expert
from data.CarRecommendationInformation import CarRecommendationInformation
from data.CarRecommendationInformationDAO import CarRecommendationInformationDAO
from expert.RecommendationAIExpert import RecommendationAIExpert
from controller.CarRecommendationBlackBoardController import CarRecommendationBlackBoardController

class CarRecommendationBlackBoard(BlackBoard[CarRecommendationInformation]):
    def __init__(self, dao: CarRecommendationInformationDAO):
        super().__init__()
        self.recommendationAIExpert: Expert[CarRecommendationInformation] = RecommendationAIExpert()
        self.controller: BlackBoardController[CarRecommendationInformation] = CarRecommendationBlackBoardController(self.recommendationAIExpert)
        self.dao: CarRecommendationInformationDAO = dao

    async def handleRequest(self, request: CarRecommendationInformation) -> CarRecommendationInformation:
        data: CarRecommendationInformation = await self.controller.handleRequest(request=request)
        return data