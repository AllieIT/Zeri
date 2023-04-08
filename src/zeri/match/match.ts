import { BaseSpark } from '../base/base';
import { Match, MatchByPuuidParams, MatchTimeline, SparkParams } from '../../models';
import { LightningCrash } from "../rateLimiter/lightningCrash";
import { MacroRegion } from "../../constants";
import { EmptySparkResponseError } from "../error/errors";

/**
 * Spark responsible for MatchV5 endpoint
 */
export class MatchSpark extends BaseSpark {

    constructor(params: SparkParams, rateLimiter: LightningCrash) {
        super(params, rateLimiter);
        this._sparkUrl = '/match/v5'
        this._requestTypes = {
            MatchIdsByPuuid: '/matches/by-puuid/{puuid}/ids',
            MatchByMatchId: '/matches/{matchId}',
            MatchTimelineByMatchId: '/matches/{matchId}/timeline'
        }
    }
    /**
     * Get match list for games played on given account PUUID and filtered using given filter parameters, if any.
     * @param region - region from which to retrieve matches
     * @param puuid - puuid of the account for which to retrieve match history
     * @param params - parameters used to filter match history
     * @param start - start index to use for fetching games
     * @param count - number of games to fetch
     */
    async getMatchIdsByPuuid(region: MacroRegion, puuid: string, params: MatchByPuuidParams = {}, start: number = 0, count: number = 20): Promise<string[]> {

        const sparkResponse = await this._request<string[]>('MatchIdsByPuuid', {
            region: region.toLowerCase(),
            puuid: puuid,
        }, {
            start: start.toString(),
            count: count.toString(),
            type: params.type,
            queue: params.queue,
            startTime: params.startTime,
            endTime: params.endTime
        });
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[Match Spark] No matches found for given parameters and puuid: ${puuid}`);
    }
    /**
     * Get match by match ID.
     * @param region - region from which to retrieve match
     * @param matchId - match ID of the match to retrieve
     */
    async getMatchByMatchId(region: MacroRegion, matchId: string): Promise<Match> {
        const sparkResponse = await this._request<Match>('MatchByMatchId', {
            region: region.toLowerCase(),
            matchId: matchId
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[Match Spark] No match found for matchId: ${matchId}`);
    }
    /**
     * Get match timeline by match ID.
     * @param region - region from which to retrieve match timeline
     * @param matchId - match ID of the match timeline to retrieve
     */
    async getMatchTimelineByMatchId(region: MacroRegion, matchId: string): Promise<MatchTimeline> {
        const sparkResponse = await this._request<MatchTimeline>('MatchTimelineByMatchId', {
            region: region.toLowerCase(),
            matchId: matchId
        }, {});
        if (sparkResponse)
            return sparkResponse.data;
        throw new EmptySparkResponseError(`[Match Spark] No match timeline found for matchId: ${matchId}`);
    }
}