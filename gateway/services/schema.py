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



class EVA(BaseModel):
    batt_time_left: float
    oxy_pri_storage: float
    oxy_sec_storage: float
    oxy_pri_pressure: float
    oxy_sec_pressure: float
    oxy_time_left: int
    heart_rate: float
    oxy_consumption: float
    co2_production: float
    suit_pressure_oxy: float
    suit_pressure_cO2: float
    suit_pressure_other: float
    suit_pressure_total: float
    fan_pri_rpm: float
    fan_sec_rpm: float
    helmet_pressure_co2: float
    scrubber_a_co2_storage: float
    scrubber_b_co2_storage: float
    temperature: float
    coolant_ml: float
    coolant_gas_pressure: float
    coolant_liquid_pressure: float

class Telemetry(BaseModel):
    eva_time: int
    eva1: EVA
    eva2: EVA

class TelemetryData(BaseModel):
    telemetry: Telemetry


class TimeTracking(BaseModel):
    started: bool
    completed: bool
    time: int

class EVA(BaseModel):
    started: bool
    paused: bool
    completed: bool
    total_time: int
    uia: TimeTracking
    dcu: TimeTracking
    rover: TimeTracking
    spec: TimeTracking

class EVAData(BaseModel):
    eva: EVA



__all__ = [
    GeoJSON.__name__, 
    Feature.__name__,
    FeatureProperties.__name__,
    PointGeometry.__name__,
    WarningItem.__name__,
    TodoItems.__name__,
    TodoItem.__name__,
    EVAData.__name__,
    TelemetryData.__name__,
    WarningItem.__name__,
    FeatureModel.__name__,
    GeoJSONFeature.__name__
]