import { AxiosResponse } from "axios";

import { SparkParams } from '../../models';
import { SparkResponse } from "../../models/spark/base/response";
import { MacroRegion, Region, StaticConstants } from '../../constants';
import { Heimerdinger } from '../../heimerdinger/heimerdinger';
import { LightningCrash } from "../rateLimiter/lightningCrash";
import { injectToString } from '../../util/stringManip';

export class BaseSpark {

    /**
     * Spark parameters containing key and debug options
     * @private
     */
    private readonly _sparkParams: SparkParams;
    /**
     * Base URL of Riot API
     * @private
     */
    private readonly _baseUrl: string;

    /**
     * URL of specific Spark
     * @protected
     */
    protected _sparkUrl: string = '';
    /**
     * Dictionary of request names and their respective URLs
     * @protected
     */
    protected _requestTypes: Record<string, string> = {};
    /**
     * Logger used by Spark
     * @protected
     */
    protected _logger: Heimerdinger;
    /**
     * Rate limiter shared by every Spark
     * @protected
     */
    protected _rateLimiter: LightningCrash;

    /**
     * Abstract class constructor
     * @param params Spark parameters containing key and debug options
     * @param rateLimiter Rate limiter shared by every Spark
     */
    constructor(params: SparkParams, rateLimiter: LightningCrash) {
        if (this.constructor === BaseSpark)
            throw new Error("Base Spark is an abstract class.");

        this._logger = new Heimerdinger('Spark');
        this._rateLimiter = rateLimiter;
        this._sparkParams = params;
        this._baseUrl = StaticConstants.SPARK_BASE_URL;
    }
    /**
     * Generic request
     * @param request Request name
     * @param queryParams Dictionary of query parameters present in pre-formatted URL
     * @protected
     */
    protected async _request<T>(request: string, queryParams: Record<string, string>): Promise<SparkResponse<T>> {
        const urlTemplate = this._baseUrl + this._sparkUrl + this._requestTypes[request];
        const url = injectToString(urlTemplate, queryParams);

        if (this._sparkParams.debug?.logUrls)
            this._logger.log(url);

        let region: Region | MacroRegion = BaseSpark._getRequestRegion(queryParams);

        // Attempt to get a response, throw an error if it fails

        try {
            const axiosResponse: AxiosResponse<T> = await this._rateLimiter.getResponse<T>(region, request, url);
            return {
                data: axiosResponse.data,
                status: axiosResponse.status
            };
        }
        catch (e) {
            if (e instanceof Error) {
                this._logger.logError(e);
            } else
                this._logger.logError(new Error("Unknown error"));
            throw new Error("Unknown error");
        }
    }
    /**
     * Returns region for which response should be made
     * @param queryParams Dictionary of query parameters present in pre-formatted URL
     * @private
     */
    private static _getRequestRegion(queryParams: Record<string, string>): Region | MacroRegion {
        if ('region' in queryParams) {
            if (Object.values(Region).map(r => r.toString().toLowerCase()).includes(queryParams['region']))
                return queryParams['region'].toUpperCase() as Region
            else
                return queryParams['region'].toUpperCase() as MacroRegion
        }

        // Return default region (EUNE) otherwise
        return Region.EUNE;
    }
}