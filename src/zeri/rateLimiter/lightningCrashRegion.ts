import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';

import { SparkParams } from "../../models";
import { Heimerdinger } from '../../heimerdinger/heimerdinger';
import { MacroRegion, Region } from "../../constants";

/**
 * Class representing a LightningCrash instance for a given region or macro-region
 */
export class LightningCrashRegion {

    private readonly _axiosSpark: AxiosInstance;
    private readonly _params: SparkParams;
    private readonly _logger: Heimerdinger;

    /**
     * Region from which the data is gathered
     */
    region: Region | MacroRegion;
    /**
     * List of app rate limits
     */
    appRateLimits: RateLimit[]
    /**
     * Dictionary of rate limits for specific method requests
     */
    methodRateLimits: Record<string, RateLimit[]>
    /**
     * Time at which requests can be retried
     */
    appRetryAt: number
    /**
     * Times at which specific method requests may be retried
     */
    methodRetryAt: Record<string, number>

    /**
     * Create a new LightningCrash instance for region
     * @param params Spark parameters
     * @param region Region or macro-region
     */
    constructor(params: SparkParams, region: Region | MacroRegion) {

        this._params = params;
        this._logger = new Heimerdinger('Lightning Crash');
        this._axiosSpark = axios.create({
            headers: {
                'X-Riot-Token': this._params.key
            }
        });

        this.region = region;

        this.appRateLimits = [
            new RateLimit(20, 1),
            new RateLimit(100, 120),
        ];
        this.methodRateLimits = {}

        this.appRetryAt = -1;
        this.methodRetryAt = {};
    }
    /**
     * Method returning a Response from Riot API
     * @param request Request name
     * @param url Request URL
     */
    async getResponse<T>(request: string, url: string): Promise<AxiosResponse<T>> {
        return this._retryAfter<T>(request, url, 0, 0);
    }
    /**
     * Actual method making a request and reattempting connection if needed
     * @param request Request name
     * @param url Request URL
     * @param wait Time to wait before trying to execute method body again
     * @param noRetries Number of retries after being rejected by Riot API (Getting 429 response)
     */
    private async _retryAfter<T>(request: string, url: string, wait: number, noRetries: number): Promise<AxiosResponse<T>> {

        // Wait for given amount of time...
        if (wait > 0)
            console.log(`Waiting for ${wait} ms...`);
        await new Promise(resolve => setTimeout(resolve, wait));

        // If there is an existing timeout, wait until given time, and after a time offset, try again.
        if (this.appRetryAt > Date.now())
            return this._retryAfter(request, url, this.appRetryAt - Date.now() + 500, noRetries);
        if (this.methodRetryAt[request] > Date.now())
            return this._retryAfter(request, url, this.methodRetryAt[request] - Date.now() + 500, noRetries);

        // Check if one can make a request by getting max delay from each of the limits
        const appDelay = Math.max(...this.appRateLimits.map(rateLimit => rateLimit.getDelay()));
        const methodDelay = Math.max(...this._getMethodRateLimits(request).map(rateLimit => rateLimit.getDelay()));

        // console.log(this.appRateLimits.map(rateLimit => rateLimit.requestTimes.length));
        // console.log(this._getMethodRateLimits(request).map(rateLimit => rateLimit.requestTimes.length));

        // If the buckets are full, wait until they empty
        if (!(appDelay == -1 && methodDelay == -1)) {

            // console.log(`App delay ${appDelay}`);
            // console.log(`Method delay ${methodDelay}`);

            if (appDelay != -1)
                this.appRetryAt = Date.now() + appDelay;
            if (methodDelay != -1)
                this.methodRetryAt[request] = Date.now() + methodDelay;

            return this._retryAfter(request, url,
                Math.max(this.appRetryAt, this.methodRetryAt[request]) - Date.now() + 500,
                noRetries);
        }

        this.appRateLimits.map(rateLimit => rateLimit.onRequest());
        this.methodRateLimits[request].map(rateLimit => rateLimit.onRequest());


        // Actual response logic
        try {
            return await this._axiosSpark.get<T>(url);
        } catch (err: AxiosError | any) {
            const response = err.response;

            // Check if rate limit was exceeded anyway
            if (response.status === 429) {

                // If yes, take action
                // Analyze response headers, set delay and retry after some time
                const appLimitResponse = response.headers['x-app-rate-limit-count'];
                const methodLimitResponse = response.headers['x-method-rate-limit-count'];
                const retryAfter = response.headers['retry-after'];

                const delay = parseInt(retryAfter) * 1000
                this.appRetryAt = delay + Date.now();

                if (this._params.debug!.logRateLimits) {
                    console.log(`Riot-forced retry no. ${noRetries + 1}`);
                    console.log(appLimitResponse);
                    console.log(methodLimitResponse);
                    console.log(" ");
                }

                //console.log(response.headers);
                return this._retryAfter(request, url, delay + 500, noRetries + 1);
            }
        }
        throw new Error("Failed to make a request");
    }
    /**
     * Get rate limit for a specific method, if it doesn't exist, create new one
     * @param request Request name
     * @private
     */
    private _getMethodRateLimits(request: string): RateLimit[] {
        if (!(request in this.methodRateLimits)) {
            this.methodRateLimits[request] = [
                new RateLimit(50, 10)
            ];
        }
        return this.methodRateLimits[request];
    }
}

/**
 * Class representing a rate limit.
 *
 * Characterized by two numbers - timespan in milliseconds and number of requests
 * that can be made in that timespan. Request times are being stored to calculate
 * time of next request that will not be blocked by the API.
 */
class RateLimit {

    /**
     * Max number of requests in given timespan
     */
    limit: number
    /**
     * Timespan of rate limit in milliseconds
     */
    time: number
    /**
     * Times of requests
     */
    requestTimes: number[]

    /**
     * Create a new rate limit
     * @param limit Max number of requests in given timespan
     * @param time Timespan in milliseconds
     */
    constructor(limit: number, time: number) {
        this.limit = limit
        this.time = time * 1000
        this.requestTimes = []
    }
    /**
     * Get time after which a new request can be made
     * @returns -1 if a request can be made, time in milliseconds to wait otherwise
     */
    getDelay(): number {
        if (this.requestTimes.length >= this.limit) {
            this.requestTimes = this.requestTimes.filter(requestTime => requestTime > Date.now() - this.time);
            if (this.requestTimes.length >= this.limit)
                return this.time - (Date.now() - this.requestTimes[0]) + 500;
        }
        return -1;
    }
    /**
     * Adds time of new request to list
     */
    onRequest(): void {
        this.requestTimes.push(Date.now());
    }
}