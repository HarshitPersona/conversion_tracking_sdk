import { LogHandler, LogEntry } from '../types';

class ConsoleLogHandler implements LogHandler {
  handle(entry: LogEntry): void {
    const { level, message, timestamp, extra, error, metadata } = entry;
    
    const formattedMessage = `[${new Date(timestamp).toISOString()}] [${level.toUpperCase()}] ${message}`;
    
    const logData: any[] = [formattedMessage];
    
    if (extra) {
      logData.push('Extra:', extra);
    }
    
    if (metadata) {
      logData.push('Metadata:', metadata);
    }
    
    if (error) {
      logData.push('Error:', error);
    }

    switch (level) {
      case 'info':
        console.info(...logData);
        break;
      case 'warn':
        console.warn(...logData);
        break;
      case 'error':
        console.error(...logData);
        break;
      default:
        console.log(...logData);
    }
  }
}

export default ConsoleLogHandler; 