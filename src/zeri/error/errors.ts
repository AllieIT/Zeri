export class EmptySparkResponseError extends Error {
    constructor(message: string) {
        super(`Empty Spark Response: ${message}`);
    }
}

export class InvalidArgumentError extends Error {
    constructor(message: string) {
        super(`Invalid Argument: ${message}`);
    }
}