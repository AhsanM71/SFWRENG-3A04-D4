from core.blackboard import BlackBoard, BlackBoardController, Expert
from core.recommendation.data.CarRecommendationInformation import CarRecommendationInformation
from core.recommendation.data.CarRecommendationInformationDAO import CarRecommendationInformationDAO
from core.recommendation.expert.RecommendationAIExpert import RecommendationAIExpert
from core.recommendation.blackboard.controller.CarRecommendationBlackBoardController import CarRecommendationBlackBoardController

class CarRecommendationBlackBoard(BlackBoard[CarRecommendationInformation]):
    def __init__(self, dao: CarRecommendationInformationDAO):
        super().__init__()
        self.recommendationAIExpert: Expert[CarRecommendationInformation] = RecommendationAIExpert()
        self.controller: BlackBoardController[CarRecommendationInformation] = CarRecommendationBlackBoardController(self.recommendationAIExpert)
        self.dao: CarRecommendationInformationDAO = dao

    async def handleRequest(self, request: CarRecommendationInformation) -> CarRecommendationInformation:
        data: CarRecommendationInformation = await self.controller.handleRequest(request=request)
        return data