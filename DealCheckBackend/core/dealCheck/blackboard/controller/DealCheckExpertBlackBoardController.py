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
            data: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.POINT_ALGORITHM_EXPERT, request=request)
        elif request.getImage() and request.getDescription() is None:
            data: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.AI_EXPERT, request=request)
        elif request.getImage() is None and request.getDescription():
            data: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.REDBOOK_EXPERT, request=request)
        else:
            data: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.AI_EXPERT, request=request)
            #dataPoint: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.POINT_ALGORITHM_EXPERT, request=request)
            #dataAI: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.AI_EXPERT, request=request)
            #dataRedbook: DealCheckData = await self.expertsService.getExpertResponse(expert=DealCheckExpertType.REDBOOK_EXPERT, request=request)
            #data: DealCheckData = await self._analyze_result(dataPoint, dataAI, dataRedbook)
        return data
        
    async def _analyze_result(self, dataPoint: DealCheckData, dataAI: DealCheckData, dataRedbook: DealCheckData) -> DealCheckData:
        pass