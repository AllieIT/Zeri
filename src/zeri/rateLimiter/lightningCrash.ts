import { SparkParams } from "../../models";
import { MacroRegion, Region } from "../../constants";
import { LightningCrashRegion } from "./lightningCrashRegion";
import { AxiosResponse } from "axios";

/**
 * Lightning Crash is a utility tool for Zeri API.
 * Its task is to retrieve and analyze rate limits from Riot API.
 */
export class LightningCrash {

    /**
     * Dictionary of rate limiters for each region and macro-region
     */
    private _rateLimiters: Record<Region | MacroRegion, LightningCrashRegion>

    /**
     * Create a LightningCrash rate limiter
     * @param params Spark parameters
     */
    constructor(params: SparkParams) {
        this._rateLimiters = {
            AMERICAS: new LightningCrashRegion(params, MacroRegion.AMERICAS),
            ASIA: new LightningCrashRegion(params, MacroRegion.ASIA),
            BR1: new LightningCrashRegion(params, Region.BR),
            EUN1: new LightningCrashRegion(params, Region.EUNE),
            EUROPE: new LightningCrashRegion(params, MacroRegion.EUROPE),
            EUW1: new LightningCrashRegion(params, Region.EUW),
            JP1: new LightningCrashRegion(params, Region.JP),
            KR: new LightningCrashRegion(params, Region.KR),
            LA1: new LightningCrashRegion(params, Region.LAN),
            LA2: new LightningCrashRegion(params, Region.LAS),
            NA1: new LightningCrashRegion(params, Region.NA),
            OC1: new LightningCrashRegion(params, Region.OCE),
            PBE1: new LightningCrashRegion(params, Region.PBE),
            RU: new LightningCrashRegion(params, Region.RU),
            SEA: new LightningCrashRegion(params, MacroRegion.SEA),
            TR1: new LightningCrashRegion(params, Region.TR),
            PH2: new LightningCrashRegion(params, Region.PH),
            SG2: new LightningCrashRegion(params, Region.SG),
            TH2: new LightningCrashRegion(params, Region.TH),
            TW2: new LightningCrashRegion(params, Region.TW),
            VN2: new LightningCrashRegion(params, Region.VN),
        };
    }
    /**
     * Get response for specific region
     * @param region Region or macro-region
     * @param request Request name
     * @param url Request URL
     */
    async getResponse<T>(region: Region | MacroRegion, request: string, url: string): Promise<AxiosResponse<T>> {
        return await this._rateLimiters[region].getResponse<T>(request, url);
    }
}