from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar('T')

class FirestoreDatabaseEntity[T](ABC):
    @abstractmethod
    @staticmethod
    def from_dict(data: dict) -> T:
        pass

    @abstractmethod
    def to_dict() -> dict:
        pass