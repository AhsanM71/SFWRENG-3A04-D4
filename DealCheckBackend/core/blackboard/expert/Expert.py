from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar('T')

def Expert[T](ABC):
    def __init__(self):
        self.queue = []

    @abstractmethod
    async def evaluateRequest(self, request: T) -> T:
        pass