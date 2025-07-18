import {gameConfig, ViteRunningMode} from "../types/dto_interface/GameConfig.interface.ts";

const LOGGER_LOG: boolean = gameConfig.mode === ViteRunningMode.Development;
const LOGGER_LOG_LOG: boolean = gameConfig.mode === ViteRunningMode.Development;
const LOGGER_LOG_DEBUG: boolean = gameConfig.mode === ViteRunningMode.Development;
const LOGGER_LOG_WARN: boolean = true;
const LOGGER_LOG_ERROR: boolean = true;
export enum LogLevel {
    Info = 0,
    Warning = 1,
    Error = 2,
    Log = 3,
    Debug = 4
}
class GaslightObject {
    private readonly name: string;
    constructor(name: string) {
        this.name = name;
    }

    public GetName(): string {
        return this.name;
    }
}

export class LoggerGaslighter {
    public CreateGaslightedLogger(name: string): Logger<GaslightObject> {
        let fake = new GaslightObject(name);
        let logger = new Logger<GaslightObject>(fake);
        logger.OverrideName(fake);
        return logger;
    }
}

class LogObject<T> {
    private readonly logger: Logger<any>;
    public stringified: string;

    constructor(logger: Logger<any>, stringified: string) {
        this.logger = logger;
        this.stringified = stringified;
    }

    public LogError(): LogObject<T> {
        this.logger.LogError(this.stringified);
        return this;
    }

    public LogDebug(): LogObject<T> {
        this.logger.LogDebug(this.stringified);
        return this;
    }

    public LogWarning(): LogObject<T> {
        this.logger.LogWarning(this.stringified);
        return this;
    }

    public LogInfo(): LogObject<T> {
        this.logger.LogInfo(this.stringified);
        return this;
    }

    public Log(): LogObject<T> {
        this.logger.Log(this.stringified);
        return this;
    }

    public PrependText(text: string = "Hello World! "): LogObject<T> {
        this.stringified = text + this.stringified;
        return this;
    }

    public AppendText(text: string = " Hello World!"): LogObject<T> {
        this.stringified = this.stringified + text;
        return this;
    }
}

export class Logger<T extends object> {
    private context: string;

    constructor(context: T) {
        this.context = context?.constructor.name
    }

    public OverrideName(gaslighter: GaslightObject): Logger<T> {
        this.context = gaslighter.GetName();
        return this;
    }

    public StringifyObject(obj: any): LogObject<T> {
        return new LogObject(this, JSON.stringify(obj));
    }

    private FormatMessage(message: string): string {
        return `[${new Date().toISOString()}] [${this.context}] ${message}`;
    }

    private LogMessage(message: string, level: LogLevel) {
        const formatted = this.FormatMessage(message);

        switch (level) {
            case LogLevel.Info:
                if (LOGGER_LOG_LOG) {
                    console.info(`[INFO] ${formatted}`);
                }
                break;
            case LogLevel.Warning:
                if (LOGGER_LOG_WARN) {
                    console.warn(`[WARNING] ${formatted}`);
                }
                break;
            case LogLevel.Error:
                if (LOGGER_LOG_ERROR) {
                    console.error(`[ERROR] ${formatted}`);
                }
                break;
            case LogLevel.Log:
                if (LOGGER_LOG) {
                    console.log(`[LOG] ${formatted}`);
                }
                break;
            case LogLevel.Debug:
                if (LOGGER_LOG_DEBUG) {
                    console.debug(`[DEBUG] ${formatted}`);
                }
                break;
        }

        // const logEntry = `${LogLevel[level]}: ${formatted}\n`
        // import fs from 'fs/promises';

        // try {
        //   await fs.appendFile('app.log', logEntry)
        // } catch (fileError) {
        //   console.error('Failed to write to log file:', fileError);
        // }

    }

    public LogInfo(message: string = "Hello World!") {
        this.LogMessage(message, LogLevel.Info);
    }

    public LogDebug(message: string = "Hello World!") {
        this.LogMessage(message, LogLevel.Debug);
    }

    public Log(message: string = "Hello World!") {
        this.LogMessage(message, LogLevel.Log);
    }

    public LogWarning(message: string = "Hello World!") {
        this.LogMessage(message, LogLevel.Warning);
    }

    public LogError(message: string = "Hello World!") {
        this.LogMessage(message, LogLevel.Error);
    }
}