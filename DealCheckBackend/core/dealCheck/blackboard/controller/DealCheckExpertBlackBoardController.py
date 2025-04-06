from copy import copy
from core.blackboard import BlackBoardController
from core.dealCheckExpertsService.DealCheckExpertsService import DealCheckExpertsService
from core.dealCheckExpertsService.Enums import DealCheckExpertType
from core.dealCheck.data.DealCheckData import DealCheckData

class DealCheckExpertBlackBoardController(BlackBoardController[DealCheckData]):
    def __init__(self, expertsService: DealCheckExpertsService):
        super().__init__()
        self.expertsService: DealCheckExpertsService = expertsService
    
    async def handleRequest(self, request: DealCheckData) -> DealCheckData:
        if request.getImage() is None and request.getDescription() is None:
            print("test1")
            data: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.POINT_ALGORITHM_EXPERT, request=request)
        elif request.getImage() and request.getDescription() is None:
            print("test2")
            data: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.AI_EXPERT, request=request)
        elif request.getImage() is None and request.getDescription():
            print("test3")
            data: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.REDBOOK_EXPERT, request=request)
        else:
            print("test4")
            dataAI: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.AI_EXPERT, request=copy(request))
            dataRedbook: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.REDBOOK_EXPERT, request=copy(request))
            dataPoint: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.POINT_ALGORITHM_EXPERT, request=copy(request))
            data: DealCheckData = await self._analyze_result(dataPoint, dataAI, dataRedbook)
        return data
        
    async def _analyze_result(self, dataPoint: DealCheckData, dataAI: DealCheckData, dataRedbook: DealCheckData) -> DealCheckData:
        yes_counter, no_counter = [], []

        # Check AI answer
        if(dataAI.getActual() == "YES"):
            yes_counter.append(dataAI)
        else:
            no_counter.append(dataAI)

        # Check Redbook answer
        if(dataRedbook.getActual() == "YES"):
            yes_counter.append(dataRedbook)
        else:
            no_counter.append(dataRedbook)

        # Check Point System answer
        if(dataPoint.getActual() == "YES"):
            yes_counter.append(dataPoint)
        else:
            no_counter.append(dataPoint)

        # Calculate majority vote
        yes_count, no_count = len(yes_counter), len(no_counter)
        isGoodDeal: bool = yes_count > no_count
        majorityVote: list[DealCheckData] = yes_counter if isGoodDeal else no_counter

        # Based on order of appends above, most trusted is always first in array
        trustedExpertResponse: DealCheckData = majorityVote[0]

        averageConfidence: float = 0
        expertsStr: str = ''

        # Merge confidence and experts used
        for response in majorityVote:
            averageConfidence += response.getConfidence()
            expertsStr += response.getExpertUsed() + ','

        # Round to 2 decimal places
        averageConfidence = round(averageConfidence/len(majorityVote), 2)
        rationale = trustedExpertResponse.getRationale().replace(str(trustedExpertResponse.getConfidence()), str(averageConfidence))

        # Update response with new values
        trustedExpertResponse.setConfidence(averageConfidence)
        trustedExpertResponse.setRationale(rationale)
        trustedExpertResponse.setExpertUsed(expertsStr.removesuffix(','))

        return trustedExpertResponse