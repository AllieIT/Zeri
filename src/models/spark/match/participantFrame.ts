import { MatchPosition } from "./matchPosition";
import { ChampionStats, DamageStats } from "../champion";

export interface TimelineParticipantFrame {
    participantId: number;

    currentGold: number;
    totalGold: number;
    goldPerSecond: number;

    minionsKilled: number;
    jungleMinionsKilled: number;
    xp: number;
    level: number;

    championStats: ChampionStats;
    damageStats: DamageStats;

    timeEnemySpentControlled: number;
    teamScore: number;
    dominionScore: number;
    position: MatchPosition;
}