import { MiniSeries } from './miniSeries';
import { Division, Tier } from '../../../constants';

export interface LeagueEntry {
    readonly leagueId: string;
    /**
     * 	Player's encrypted summonerId.
     */
    readonly summonerId: string;
    readonly summonerName: string;

    readonly queueType: string;
    readonly tier: Tier;
    /**
     * 	The player's division within a tier.
     */
    readonly rank: Division
    readonly leaguePoints: number;

    readonly wins: number;
    readonly losses: number;

    readonly hotStreak: boolean;
    readonly veteran: boolean;
    readonly freshBlood: boolean;
    readonly inactive: boolean;
    readonly miniseries: MiniSeries;
}