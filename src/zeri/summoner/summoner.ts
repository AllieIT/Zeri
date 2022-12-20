import { BaseSpark } from '../base/base';
import { SparkParams } from '../../models';
import { LightningCrash } from "../rateLimiter/lightningCrash";

export class SummonerSpark extends BaseSpark {

    constructor(params: SparkParams, rateLimiter: LightningCrash) {
        super(params, rateLimiter);
    }

}