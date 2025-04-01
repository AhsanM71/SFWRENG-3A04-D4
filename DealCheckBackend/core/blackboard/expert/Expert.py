from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar('T')

class Expert(Generic[T], ABC):
    def __init__(self):
        self.queue = []

    @abstractmethod
    async def evaluateRequest(self, request: T) -> T:
        pass