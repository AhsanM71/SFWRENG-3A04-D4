from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar('T')

class FirestoreDatabaseEntity[T](ABC):
    @staticmethod
    @abstractmethod
    def from_dict(data: dict) -> T:
        pass

    @abstractmethod
    def to_dict(self) -> dict:
        pass