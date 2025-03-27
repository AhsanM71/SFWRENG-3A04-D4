from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar('T')

class BlackBoardController[T](ABC):
    @abstractmethod
    async def handleRequest(self, request: T) -> T:
        pass