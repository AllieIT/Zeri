import { BaseSpark } from '../base/base';
import { SparkParams, Summoner } from '../../models';
import { LightningCrash } from "../rateLimiter/lightningCrash";
import { Region } from "../../constants";

export class SummonerSpark extends BaseSpark {

    constructor(params: SparkParams, rateLimiter: LightningCrash) {
        super(params, rateLimiter);
        this._sparkUrl = '/summoner/v4'
        this._requestTypes = {
            SummonerBySummonerId: '/summoners/{encryptedSummonerId}',
            SummonerByName: '/summoners/by-name/{summonerName}',
        }
    }

    /**
     * Returns Summoner with given encrypted summoner ID
     * @param region region from which to retrieve the summoner
     * @param encryptedSummonerId encrypted summoner ID (e.g. from League V4 endpoint)
     */
    async getSummonerBySummonerId(region: Region, encryptedSummonerId: string): Promise<Summoner> {
        const sparkResponse = await this._request<Summoner>('SummonerBySummonerId', {
            region: region.toLowerCase(),
            encryptedSummonerId: encryptedSummonerId
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new Error(`Player with summonerId ${encryptedSummonerId} not found`)
    }

}