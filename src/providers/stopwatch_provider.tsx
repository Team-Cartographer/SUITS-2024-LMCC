/**
 * @author @abhi-arya1
 * @function StopwatchProvider
 * @fileoverview https://docs.google.com/document/d/1Zqneli7AeubiU10YHZqsq5emFCdpV_srpxIv92XRRfg/
 */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/function-component-definition */
import {
    createContext,
    useState,
    useContext,
    FunctionComponent,
    useCallback,
    ReactNode,
    useEffect,
} from 'react';

interface StopwatchContextType {
    time: number;
    isRunning: boolean;
    formattedTime: string;
    handleStartStop: () => void;
    handleReset: () => void;
}

const defaultContext: StopwatchContextType = {
    time: 0,
    isRunning: false,
    formattedTime: '00:00:00',
    handleStartStop: () => {},
    handleReset: () => {},
};

interface StopwatchProviderProps {
    children: ReactNode;
}

const StopwatchContext = createContext<StopwatchContextType>(defaultContext);

export const useStopwatch = () => useContext(StopwatchContext);

export const StopwatchProvider: FunctionComponent<StopwatchProviderProps> = ({
    children,
}) => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const formatTime = useCallback((time: number): string => {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    useEffect(() => {
        let interval: number | null = null;

        if (isRunning) {
            interval = window.setInterval(() => {
                if (startTime !== null) {
                    const now = Date.now();
                    setTime(now - startTime);
                }
            }, 1000);
        } else if (!isRunning && interval !== null) {
            window.clearInterval(interval);
        }

        return () => {
            if (interval !== null) {
                window.clearInterval(interval);
            }
        };
    }, [isRunning, startTime]);

    const handleStartStop = useCallback(() => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            setStartTime((prevStartTime) =>
                prevStartTime !== null ? prevStartTime : Date.now() - time,
            );
            setIsRunning(true);
        }
    }, [isRunning, time, startTime]);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setTime(0);
        setStartTime(null);
    }, []);

    const formattedTime = formatTime(time);

    return (
        <StopwatchContext.Provider
            value={{
                time,
                isRunning,
                formattedTime,
                handleStartStop,
                handleReset,
            }}
        >
            {children}
        </StopwatchContext.Provider>
    );
};
