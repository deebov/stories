import { useEffect, useRef, useState } from 'react';

export type TimerType = 'DECREMENTAL' | 'INCREMENTAL';

export interface IConfig {
  endTime: number | null;
  initialTime: number;
  interval: number;
  step: number;
  timerType: TimerType;
}

export interface IValues {
  pause: () => void;
  reset: () => void;
  start: () => void;
  time: number;
}

const initialConfig: IConfig = {
  endTime: null,
  initialTime: 0,
  interval: 1000,
  step: 1,
  timerType: 'INCREMENTAL',
};

export const useTimer = (config?: Partial<IConfig>): IValues => {
  const { endTime, initialTime, interval, step, timerType } = {
    ...initialConfig,
    ...config,
  };
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const [shouldResetTime, setShouldResetTime] = useState(false);
  const [time, setTime] = useState(initialTime);

  const cancelTimers = () => {
    cancelInterval();
  };

  const cancelInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const createInterval = () => {
    if (endTime === null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setTime((previousTime) => {
        const newTime =
          timerType === 'INCREMENTAL'
            ? previousTime + step
            : previousTime - step;

        if (previousTime >= endTime) {
          cancelTimers();
          setShouldResetTime(true);
          return endTime;
        }
        return newTime;
      });
    }, interval);
  };

  const pause = () => {
    pausedTimeRef.current = time;

    cancelTimers();
  };

  const reset = () => {
    pausedTimeRef.current = null;

    cancelTimers();
    resetTime();
  };

  const resetTime = () => {
    setTime(initialTime);
  };

  const start = () => {
    if (intervalRef.current) {
      return;
    }

    if (shouldResetTime) {
      resetTime();
      setShouldResetTime(false);
    }

    createInterval();
  };

  useEffect(() => cancelTimers, []);

  return { pause, reset, start, time };
};
