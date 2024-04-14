from typing import List, TypedDict

from pydantic import BaseModel


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



class TodoItem(BaseModel):
    todoItems: List[List[str]]

class WarningItem(BaseModel): 
    infoWarning: str

class FeatureModel(BaseModel): 
    type: str
    geometry: dict
    properties: dict

class GeoJSONFeature(BaseModel): 
    feature: dict



__all__ = [
    GeoJSON.__name__, 
    Feature.__name__,
    FeatureProperties.__name__,
    PointGeometry.__name__,
    WarningItem.__name__,
    TodoItems.__name__,
    TodoItem.__name__,
    WarningItem.__name__,
    FeatureModel.__name__,
    GeoJSONFeature.__name__
]