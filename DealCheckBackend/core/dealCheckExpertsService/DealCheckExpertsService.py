from Enums import DealCheckExpertType
from core.dealCheck.experts.AIAgent import AIAgent
from core.dealCheck.experts.PointSys import PointSys
from core.dealCheck.experts.Redbook import Redbook
from core.dealCheck.data.DealCheckData import DealCheckData

expert_map = {
    DealCheckExpertType.AI_EXPERT: AIAgent(),
    DealCheckExpertType.POINT_ALGORITHM_EXPERT: PointSys(),
    DealCheckExpertType.REDBOOK_EXPERT: Redbook(),
}
class DealCheckExpertsService():
    def __init__():
        pass
    
    async def getExpertResponse(self, expert: DealCheckExpertType, request: DealCheckData) -> DealCheckData:
        pass