/**
 * Logger class for better message formatting
 */
export class Heimerdinger {

    /**
     * Prefix used at the start of each message.
     *
     * Helps to localize the place from which Heimerdinger methods are being called.
     * @private
     */
    private readonly _prefix: string = 'Heimerdinger'

    /**
     * Create a new logger instance
     * @param secondaryPrefix Prefix used at the start of each message
     */
    constructor(secondaryPrefix?: string) {
        if (secondaryPrefix !== undefined) {
            this._prefix += ` - ${secondaryPrefix}`;
        }
        // this.log('Heimerdinger initialized');
    }
    /**
     * Log an object or any other message
     * @param message Object / message to print
     */
    log(message: any) {
        let finalMessage = message;
        if (typeof message == 'object') {
            finalMessage = JSON.stringify(message, null, 4);
        }
        console.log(`[${this._prefix}] ${finalMessage}`);
    }
    /**
     * Log error and throw it
     * @param error Error to print
     */
    logError(error: Error) {
        console.log(`[${this._prefix}] Error: {${error.message}}`);
    }
}