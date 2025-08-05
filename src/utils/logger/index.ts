import { LoggerConfig, LogData, LogEntry, LogLevel } from './types';

class Logger {
  private readonly handlers: import('./types').LogHandler[];
  private readonly metadata: Record<string, any>;

  constructor(config: LoggerConfig) {
    this.handlers = config.handlers;
    this.metadata = config.metadata || {};
  }

  private log(level: LogLevel, data: LogData): void {
    const entry: LogEntry = {
      ...data,
      level,
      timestamp: Date.now(),
      metadata: this.metadata,
    };

    this.handlers.forEach(handler => {
      try {
        handler.handle(entry);
      } catch (error) {
        // Prevent logging errors from breaking the application
        console.error('Logger handler error:', error);
      }
    });
  }

  info(data: LogData): void {
    this.log('info', data);
  }

  warn(data: LogData): void {
    this.log('warn', data);
  }

  error(data: LogData): void {
    this.log('error', data);
  }
}

export default Logger; 