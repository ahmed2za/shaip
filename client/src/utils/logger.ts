type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  details?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, context: string, message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      details,
    };

    this.logs.push(entry);
    
    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      console[level](`[${entry.level.toUpperCase()}] ${entry.context}: ${entry.message}`, details || '');
    }

    // Here you can add integration with external logging services like Sentry
    if (level === 'error' && typeof window !== 'undefined') {
      // Example: Sentry.captureException(details);
    }
  }

  info(context: string, message: string, details?: any) {
    this.log('info', context, message, details);
  }

  warn(context: string, message: string, details?: any) {
    this.log('warn', context, message, details);
  }

  error(context: string, message: string, details?: any) {
    this.log('error', context, message, details);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }
}

export const logger = Logger.getInstance();
