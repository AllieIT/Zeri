import { LeagueEntry, LeagueList, SparkParams } from '../../models';
import { Division, Queue, Region, Tier } from '../../constants';
import { LightningCrash } from "../rateLimiter/lightningCrash";
import { BaseSpark } from '../base/base';
import { EmptySparkResponseError, InvalidArgumentError } from "../error/errors";

/**
 * Spark responsible for LeagueV4 endpoint
 */
export class LeagueSpark extends BaseSpark {

    constructor(params: SparkParams, rateLimiter: LightningCrash) {
        super(params, rateLimiter);
        this._sparkUrl = '/league/v4'
        this._requestTypes = {
            EntriesByDivision: '/entries/{queue}/{tier}/{division}',
            EntriesBySummonerId: '/entries/by-summoner/{encryptedSummonerId}',
            EntriesForChallenger: '/challengerleagues/by-queue/{queue}',
            EntriesForGrandmaster: '/grandmasterleagues/by-queue/{queue}',
            EntriesForMaster: '/masterleagues/by-queue/{queue}',
            LeagueById: '/leagues/{leagueId}',
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
     *
     * @see https://developer.riotgames.com/apis#league-v4/GET_getLeagueEntries
     */
    async getEntriesByDivision(region: Region, queue: Queue, tier: Tier, division: Division, page: number = 1): Promise<LeagueEntry[]> {
        if (page < 1)
            throw new InvalidArgumentError(`Page number must be greater than 0, got ${page}`);

        const sparkResponse = await this._request<LeagueEntry[]>('EntriesByDivision', {
            region: region.toLowerCase(),
            queue: queue,
            tier: tier,
            division: division,
        }, {
            page: page
        });
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[League Spark] No entries found for parameters: ${queue}, ${tier}, ${division}, page ${page}`);
    }
    /**
     * Returns league entries in all queues for a summoner with given ID.
     * @param region - region from which to retrieve entries
     * @param encryptedSummonerId - encrypted summoner ID (e.g. from League or Summoner Sparks)
     *
     * @see https://developer.riotgames.com/apis#league-v4/GET_getLeagueEntriesForSummoner
     */
    async getLeagueEntriesBySummonerId(region: Region, encryptedSummonerId: string): Promise<LeagueEntry[]> {
        const sparkResponse = await this._request<LeagueEntry[]>('EntriesBySummonerId', {
            region: region.toLowerCase(),
            encryptedSummonerId: encryptedSummonerId
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[League Spark] No entries found for summonerId ${encryptedSummonerId}`);
    }
    /**
     * Returns challenger league for given queue.
     * @param region - region from which to retrieve entries
     * @param queue - name of the ranked queue
     *
     * @see https://developer.riotgames.com/apis#league-v4/GET_getChallengerLeague
     */
    async getChallengerLeague(region: Region, queue: Queue): Promise<LeagueList> {
        const sparkResponse = await this._request<LeagueList>('EntriesForChallenger', {
            region: region.toLowerCase(),
            queue: queue
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[League Spark] No challenger league found for queue ${queue}`);
    }
    /**
     * Returns grandmaster league for given queue.
     * @param region - region from which to retrieve entries
     * @param queue - name of the ranked queue
     *
     * @see https://developer.riotgames.com/apis#league-v4/GET_getGrandmasterLeague
     */
    async getGrandmasterLeague(region: Region, queue: Queue): Promise<LeagueList> {
        const sparkResponse = await this._request<LeagueList>('EntriesForGrandmaster', {
            region: region.toLowerCase(),
            queue: queue
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[League Spark] No grandmaster league found for queue ${queue}`);
    }
    /**
     * Returns master league for given queue.
     * @param region - region from which to retrieve entries
     * @param queue - name of the ranked queue
     *
     * @see https://developer.riotgames.com/apis#league-v4/GET_getMasterLeague
     */
    async getMasterLeague(region: Region, queue: Queue): Promise<LeagueList> {
        const sparkResponse = await this._request<LeagueList>('EntriesForMaster', {
            region: region.toLowerCase(),
            queue: queue
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[League Spark] No master league found for queue ${queue}`);
    }
    /**
     * Returns league for given league ID.
     *
     * WARNING: Consistently looking up league ids that don't exist will result in a blacklist.
     *
     * @param region - region from which to retrieve entries
     * @param leagueId - league ID
     *
     * @see https://developer.riotgames.com/apis#league-v4/GET_getLeagueById
     */
    async getLeagueById(region: Region, leagueId: string): Promise<LeagueList> {
        const sparkResponse = await this._request<LeagueList>('LeagueById', {
            region: region.toLowerCase(),
            leagueId: leagueId
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[League Spark] No league found for leagueId ${leagueId}`);
    }
}