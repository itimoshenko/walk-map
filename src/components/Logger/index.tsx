import React, {
  PropsWithChildren,
  createContext, memo, useCallback, useContext, useMemo, useRef,
} from 'react';

type Log = {
  message: string;
  timestamp: string;
};

type LoggerContextValue = {
  getLogs: () => Log[];
  log: (message: string) => void;
};

const LoggerContext = createContext<LoggerContextValue>({ getLogs: () => [], log: () => {} });
const useLogger = () => useContext(LoggerContext);

const LoggerProvider: React.FC<PropsWithChildren> = memo(({ children }) => {
  const logs = useRef<Log[]>([]);

  const log = useCallback((message: string) => {
    const newLog = {
      message,
      timestamp: new Date().toISOString(),
    };

    logs.current.unshift(newLog);
  }, []);

  const getLogs = useCallback(() => logs.current, []);

  const loggerContextValue = useMemo(() => ({ getLogs, log }), [getLogs, log]);

  return (
    <LoggerContext.Provider value={loggerContextValue}>
      {children}
    </LoggerContext.Provider>
  );
});

export { useLogger, LoggerProvider };
