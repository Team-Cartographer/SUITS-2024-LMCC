from typing import List, TypedDict


class TodoItems(TypedDict): 
    todoItems: List[List[str]]

class WarningItem(TypedDict): 
    infoWarning: str 

class PointGeometry(TypedDict):
    type: str
    coordinates: List[float]

class FeatureProperties(TypedDict):
    name: str
    description: str

class Feature(TypedDict):
    type: str
    geometry: PointGeometry
    properties: FeatureProperties

class GeoJSON(TypedDict):
    type: str
    features: List[Feature]

__all__ = [
    GeoJSON.__name__, 
    Feature.__name__,
    FeatureProperties.__name__,
    PointGeometry.__name__,
    WarningItem.__name__,
    TodoItems.__name__
]