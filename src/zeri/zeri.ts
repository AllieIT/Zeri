import { config } from 'dotenv'

import { MatchSpark } from './match/match'
import { LeagueSpark } from './league/league';
import { SummonerSpark } from './summoner/summoner';
import { DataDragonSpark } from './dataDragon/dataDragon';
import { IDebugOptions, ISparkParams } from '../models';

config({ path: __dirname + '../.env' });

export class Zeri {

    readonly match: MatchSpark;
    readonly league: LeagueSpark;
    readonly summoner: SummonerSpark;
    readonly dataDragon: DataDragonSpark;

    private readonly _params: ISparkParams;
    private readonly _debug: IDebugOptions;
    private _key: string;

    constructor(params: string | ISparkParams) {
        this.match = new MatchSpark();
        this.league = new LeagueSpark();
        this.summoner = new SummonerSpark();
        this.dataDragon = new DataDragonSpark();

        this._key = process.env.RIOT_API_KEY || '';
        this._debug = { logUrls: false, logRateLimits: false };
        this._params = { key: this._key, debug: this._debug };

        console.log(typeof params);
        if (typeof params === 'string') {
            this._key = params;
        }
        else if (params) {
            this.params = params;
        }
    }

    private set params(params: ISparkParams) {
        if (typeof params.key !== 'undefined') {
            this._key = params.key;
        }
        if (typeof params.debug !== 'undefined') {
            if (typeof params.debug.logUrls !== 'undefined') {
                this._debug.logUrls = params.debug.logUrls;
            }
            if (typeof params.debug.logRateLimits !== 'undefined') {
                this._debug.logRateLimits = params.debug.logRateLimits;
            }
        }
        console.log(params);
    }

    private get params(): ISparkParams {
        return this._params;
    }
}