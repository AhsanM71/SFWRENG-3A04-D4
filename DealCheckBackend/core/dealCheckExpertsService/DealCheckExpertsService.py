from Enums import DealCheckExpertType
from core.dealCheck.experts.AIAgent import AIAgent
from core.dealCheck.experts.PointSys import PointSys
from core.dealCheck.experts.Redbook import Redbook
from core.dealCheck.data.DealCheckData import DealCheckData
from core.blackboard import Expert

_expert_map = {
    DealCheckExpertType.AI_EXPERT: AIAgent(),
    DealCheckExpertType.POINT_ALGORITHM_EXPERT: PointSys(),
    DealCheckExpertType.REDBOOK_EXPERT: Redbook(),
}
class DealCheckExpertsService():
    def __init__(self):
        self.queue = []
        pass
    
    async def getExpertResponse(self, expert: DealCheckExpertType, request: DealCheckData) -> DealCheckData:
        selected_expert: Expert[DealCheckData] = _expert_map[expert]
        data: DealCheckData = await selected_expert.evaluateRequest(request=request)
        return data