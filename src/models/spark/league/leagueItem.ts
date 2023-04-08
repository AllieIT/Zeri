import { MiniSeries } from './miniSeries';
import { Division } from '../../../constants';

export interface LeagueItem {
    /**
     * 	The player's division within a tier.
     */
    readonly rank: Division
    readonly leaguePoints: number;

    readonly wins: number;
    readonly losses: number;

    /**
     * 	Player's encrypted summonerId.
     */
    readonly summonerId: string;
    readonly summonerName: string;

    readonly miniseries: MiniSeries;
    readonly inactive: boolean;
    readonly veteran: boolean;
    readonly freshBlood: boolean;
    readonly hotStreak: boolean;
}