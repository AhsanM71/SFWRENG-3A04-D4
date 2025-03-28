from blackboard import Expert
from core.data import Car
from ..data.CarRecommendationInformation import CarRecommendationInformation

class RecommendationAIExpert(Expert[CarRecommendationInformation]):
    async def evaluateRequest(self, request: CarRecommendationInformation) -> CarRecommendationInformation:
        pass

    async def _generateScenarioBasedRecommendation(info: CarRecommendationInformation) -> CarRecommendationInformation:
        pass

    async def _generateDepricationCurve(car: Car) -> str:
        pass