export interface ISparkParams {
    key?: string;
    debug?: IDebugOptions;
}

export interface IDebugOptions {
    logUrls?: boolean;
    logRateLimits?: boolean;
}