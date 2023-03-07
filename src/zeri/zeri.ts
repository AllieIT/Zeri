import { config } from 'dotenv'

import { SparkParams } from '../models';

import { MatchSpark } from './match/match'
import { LeagueSpark } from './league/league';
import { SummonerSpark } from './summoner/summoner';
import { DataDragonSpark } from './dataDragon/dataDragon';
import { Heimerdinger } from "../heimerdinger/heimerdinger";
import { LightningCrash } from "./rateLimiter/lightningCrash";

config({ path: __dirname + '/../.env'});

/**
 * Zeri is a wrapper for Riot API written in TypeScript
 * used to retrieve data from Riot servers located in any region.
 *
 * It implements a rate limiter ensuring the fastest possible data retrieving
 * and prevents making too many requests to the API, avoiding blacklisting.
 */
export class Zeri {
    /**
     * Spark responsible for MatchV5 endpoint
     */
    readonly match: MatchSpark;
    /**
     * Spark responsible for LeagueV4 endpoint
     */
    readonly league: LeagueSpark;
    /**
     * Spark responsible for SummonerV4 endpoint
     */
    readonly summoner: SummonerSpark;
    /**
     * Spark responsible for Data Dragon
     */
    readonly dataDragon: DataDragonSpark;

    private readonly _params: SparkParams;
    private readonly _rateLimiter: LightningCrash;
    private readonly _logger: Heimerdinger;

    /**
     * Create a new Zeri instance
     * @param params String containing API key or object of type SparkParams
     */
    constructor(params: string | SparkParams) {

        this._logger = new Heimerdinger();

        if (typeof params === 'string')
            this._params = { key: params, debug: { logUrls: false, logRateLimits: false } };
        else
            this._params = params;

        this._rateLimiter = new LightningCrash(this._params);

        this.match = new MatchSpark(this._params, this._rateLimiter);
        this.league = new LeagueSpark(this._params, this._rateLimiter);
        this.summoner = new SummonerSpark(this._params, this._rateLimiter);
        this.dataDragon = new DataDragonSpark(this._params, this._rateLimiter);
    }
}