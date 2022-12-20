import { LeagueEntry, SparkParams } from '../../models';
import { Division, Queue, Region, Tier } from '../../constants';
import { LightningCrash } from "../rateLimiter/lightningCrash";
import { BaseSpark } from '../base/base';

/**
 * Spark responsible for LeagueV4 endpoint
 */
export class LeagueSpark extends BaseSpark {

    constructor(params: SparkParams, rateLimiter: LightningCrash) {
        super(params, rateLimiter);
        this._sparkUrl = '/league/v4'
        this._requestTypes = {
            EntriesByDivision: '/entries/{queue}/{tier}/{division}?page={page}',
            EntriesBySummonerId: '/entries/by-summoner/{encryptedSummonerId}',
        }
    }

    /**
     * Returns all summoner entries for Ranked Queue in given tier and division.
     * Entries are returned split up into pages.
     * @param region - region from which to retrieve entries
     * @param queue - name of the ranked queue
     * @param tier - ranked tier
     * @param division - division within a tier
     * @param page - page of entries
     */
    async getEntriesByDivision(region: Region, queue: Queue, tier: Tier, division: Division, page: number = 1): Promise<LeagueEntry[]> {
        const sparkResponse = await this._request<LeagueEntry[]>('EntriesByDivision', {
            region: region.toLowerCase(),
            queue: queue,
            tier: tier,
            division: division,
            page: page.toString()
        });
        if (sparkResponse) {
            return sparkResponse.data;
        }
        return [];
    }
}