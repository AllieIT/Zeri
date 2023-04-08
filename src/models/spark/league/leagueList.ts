import { Queue, Tier } from '../../../constants';
import { LeagueItem } from "./leagueItem";

export interface LeagueList{
    readonly leagueId: string;
    readonly entries: LeagueItem[];
    readonly tier: Tier;
    readonly name: string;
    readonly queue: Queue;
}