from __future__ import annotations
from core.blackboard.expert.Expert import Expert
from core.dealCheck.data.DealCheckData import DealCheckData

class PointSys(Expert[DealCheckData]):
    def __init__(self):
        pass
    
    async def evaluateRequest(self, request: DealCheckData) -> DealCheckData:
        pass