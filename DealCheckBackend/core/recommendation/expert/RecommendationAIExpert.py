from blackboard import Expert
from ..data.CarRecommendationInformation import CarRecommendationInformation

class RecommendationAIExpert(Expert[CarRecommendationInformation]):
    async def evaluateRequest(self, request: CarRecommendationInformation) -> CarRecommendationInformation:
        pass