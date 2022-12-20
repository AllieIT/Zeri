export interface SparkParams {
    key: string;
    debug?: DebugOptions;
}

export interface DebugOptions {
    logUrls?: boolean;
    logRateLimits?: boolean;
}