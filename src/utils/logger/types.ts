export type LogLevel = 'info' | 'warn' | 'error';

export interface LogData {
  message: string;
  extra?: Record<string, any>;
  error?: Error;
}

export interface LogEntry extends LogData {
  level: LogLevel;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface LogHandler {
  handle(entry: LogEntry): void;
}

export interface LoggerConfig {
  handlers: LogHandler[];
  metadata?: Record<string, any>;
} 