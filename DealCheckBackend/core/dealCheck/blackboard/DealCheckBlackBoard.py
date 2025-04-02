from core.blackboard import BlackBoard, BlackBoardController
from core.dealCheck.data.DealCheckData import DealCheckData
from core.dealCheck.data.DealCheckDAO import DealCheckDAO
from core.dealCheckExpertsService.DealCheckExpertsService import DealCheckExpertsService
from core.dealCheck.blackboard.controller.DealCheckExpertBlackBoardController import DealCheckExpertBlackBoardController
        
class DealCheckBlackBoard(BlackBoard[DealCheckData]):
    def __init__(self, dealCheckDAO: DealCheckDAO):
        super().__init__()
        self.dealCheckDAO: DealCheckDAO = dealCheckDAO
        self.expertsService: DealCheckExpertsService = DealCheckExpertsService()
        self.controller: BlackBoardController[DealCheckData] = DealCheckExpertBlackBoardController(self.expertsService)
        
    async def handleRequest(self, request: DealCheckData) -> DealCheckData:
        data: DealCheckData = await self.controller.handleRequest(request=request)
        return data