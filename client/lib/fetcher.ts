import { fetchWithoutParams, fetchWithParams } from '@/api/fetchServer';
import { 
    GeoJSON, 
    TodoItems,
    WarningData,
    TimerType,
    SpecItem,
    SpecRequest,
    EVASpecItems,
    Biometrics,
    RoverData,
    ErrorData,
} from "@/lib/types";
import { 
    defaultTodoValue,
    defaultWarningValue,
    defaultRoverValue,
    defaultGEOJSONValue,
    defaultSpecValue, 
    defaultTimerValue, 
    defaultBiometricValue,
    defaultErrorValue
} from "@/lib/defaults";

const TICKSPEED = 1000;

type State = {
    missionTime: string;
    specTime: string;
    uiaTime: string;
    roverTime: string;
    dcuTime: string;
    warningData: WarningData;
    todoItems: TodoItems;
    mapGeoJSON: GeoJSON;
    eva1SpecItem: SpecItem;
    eva2SpecItem: SpecItem;
    biometricDataEva1: Biometrics;
    biometricDataEva2: Biometrics;
    roverData: RoverData;
    errorData: ErrorData;
};

type Subscriber = (state: State) => void;

class SingletonDataFetcher {
    private static instance: SingletonDataFetcher;
    private state: State;
    private subscribers: Subscriber[];
    private interval: NodeJS.Timeout | null;

    private constructor() {
        this.state = {
            missionTime: "00:00:00",
            specTime: "00:00:00",
            uiaTime: "00:00:00",
            roverTime: "00:00:00",
            dcuTime: "00:00:00",
            warningData: defaultWarningValue,
            todoItems: defaultTodoValue,
            mapGeoJSON: defaultGEOJSONValue,
            eva1SpecItem: defaultSpecValue.eva1,
            eva2SpecItem: defaultSpecValue.eva2,
            biometricDataEva1: defaultBiometricValue,
            biometricDataEva2: defaultBiometricValue,
            roverData: defaultRoverValue,
            errorData: defaultErrorValue,
        };

        this.subscribers = [];
        this.interval = null;
    }

    public static getInstance(): SingletonDataFetcher {
        if (!SingletonDataFetcher.instance) {
            SingletonDataFetcher.instance = new SingletonDataFetcher();
        }
        console.log("HERE");
        console.log(SingletonDataFetcher.instance); 
        return SingletonDataFetcher.instance;
    }

    public subscribe(callback: Subscriber): void {
        this.subscribers.push(callback);
        callback(this.state); // Immediately call back with the current state
    }

    public unsubscribe(callback: Subscriber): void {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    private notify(): void {
        this.subscribers.forEach(callback => callback(this.state));
    }

    private async fetchData(): Promise<void> {
        try {
            const eva_data = await fetchWithoutParams<{ telemetry: { eva_time: number } }>('tss/telemetry');
            if (eva_data?.telemetry?.eva_time !== undefined) {
                this.state.missionTime = formatTime(eva_data.telemetry.eva_time);
            }

            const timer_data = await fetchWithoutParams<{ 
                eva: { 
                    uia: { time: number }, 
                    spec: { time: number },
                    rover: { time: number },
                    dcu: { time: number }
                }
            }>('tss/eva_info');
            if (timer_data?.eva?.uia?.time !== undefined) {
                this.state.uiaTime = formatTime(timer_data.eva.uia.time);
            }
            if (timer_data?.eva?.spec?.time !== undefined) {
                this.state.specTime = formatTime(timer_data.eva.spec.time);
            }
            if (timer_data?.eva?.rover?.time !== undefined) {
                this.state.roverTime = formatTime(timer_data.eva.rover.time);
            }
            if (timer_data?.eva?.dcu?.time !== undefined) {
                this.state.dcuTime = formatTime(timer_data.eva.dcu.time);
            }

            const warningData = await fetchWithoutParams<WarningData>('warning');
            if (warningData) {
                this.state.warningData = warningData;
            } else {
                this.state.warningData = defaultWarningValue;
            }

            const todoData = await fetchWithoutParams<TodoItems>('todo');
            if (todoData) {
                this.state.todoItems = todoData;
            } else {
                this.state.todoItems = defaultTodoValue;
            }

            const mapData = await fetchWithoutParams<GeoJSON>('geojson');
            if (mapData) {
                this.state.mapGeoJSON = mapData;
            } else {
                this.state.mapGeoJSON = defaultGEOJSONValue;
            }

            const errorData = await fetchWithoutParams<ErrorData>('mission/error');
            if (errorData) {
                this.state.errorData = errorData;
                if (errorData.error.oxy_error) {
                    this.updateWarning('Oxygen Error Detected! Run appropriate procedure!');
                }
                if (errorData.error.pump_error) {
                    this.updateWarning('Pump Error Detected! Run appropriate procedure!');
                }
                if (errorData.error.fan_error) {
                    this.updateWarning('Fan Error Detected! Run appropriate procedure!');
                }
            } else {
                this.state.errorData = defaultErrorValue;
            }

            const biometricData = await fetchWithoutParams<Biometrics>('tss/telemetry');
            if (biometricData) {
                this.state.biometricDataEva1 = biometricData
                this.state.biometricDataEva2 = biometricData
            } else {
                this.state.biometricDataEva1 = defaultBiometricValue;
                this.state.biometricDataEva2 = defaultBiometricValue;
            }

            const specData = await fetchWithoutParams<SpecRequest>('mission/spec');
            if (specData) {
                this.state.eva1SpecItem = specData.spec["eva1"];
                this.state.eva2SpecItem = specData.spec["eva2"];
            } else {
                this.state.eva1SpecItem = defaultSpecValue.eva1;
                this.state.eva2SpecItem = defaultSpecValue.eva2;
            }

            const roverDataTemp = await fetchWithoutParams<RoverData>('mission/rover');
            if (roverDataTemp) {
                this.state.roverData = roverDataTemp;
            } else {
                this.state.roverData = defaultRoverValue;
            }

            this.notify(); // Notify all subscribers with updated state
        } catch (error) {
            console.error('error fetching some data:', error);
        }
    }

    public startFetching(): void {
        if (this.interval) return; // Already fetching
        this.fetchData(); // Fetch data initially
        this.interval = setInterval(() => this.fetchData(), TICKSPEED);
    }

    public stopFetching(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    public async updateTodoItems(newItem: string): Promise<void> {
        const newItems = await fetchWithParams('settodo', {
            todoItems: [...(this.state.todoItems.todoItems || []), [newItem, "False"]]
        });
        this.state.todoItems = newItems;
        this.notify(); // Notify all subscribers with updated state
    }

    public async updateTodoItemsViaList(newItems: string[][]): Promise<void> {
        const _newItems = await fetchWithParams('settodo', { todoItems: newItems });
        this.state.todoItems = _newItems;
        this.notify(); // Notify all subscribers with updated state
    }

    public async updateWarning(warning: string): Promise<void> {
        const warningData = await fetchWithParams('setwarning', { infoWarning: warning });
        this.state.warningData = warningData;
        this.notify(); // Notify all subscribers with updated state
    }

    // Getter methods for state
    public getMissionTimes(): TimerType {
        return {
            mission: this.state.missionTime,
            uia: this.state.uiaTime,
            spec: this.state.specTime,
            dcu: this.state.dcuTime,
            rover: this.state.roverTime,
        };
    }

    public getTodoData(): TodoItems {
        return this.state.todoItems;
    }

    public getWarningData(): WarningData {
        return this.state.warningData;
    }

    public getGeoJSONData(): GeoJSON {
        return this.state.mapGeoJSON;
    }

    public getSpecData(): EVASpecItems {
        return {
            eva1: this.state.eva1SpecItem,
            eva2: this.state.eva2SpecItem,
        };
    }

    public getTelemetryData(evaNumber: number): Biometrics {
        if (evaNumber === 1) {
            return this.state.biometricDataEva1;
        } else if (evaNumber === 2) {
            return this.state.biometricDataEva2;
        } else {
            throw new Error(`Invalid Eva number: ${evaNumber}`);
        }
    }

    public getRoverData(): RoverData {
        return this.state.roverData;
    }

    public getErrorData(): ErrorData {
        return this.state.errorData;
    }

    public getState(): State {
        return this.state;
    }
}

const singletonDataFetcher = SingletonDataFetcher.getInstance();
export default singletonDataFetcher;

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs].map(v => v < 10 ? "0" + v : v).join(":");
}
