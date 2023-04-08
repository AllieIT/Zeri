import { MatchPosition } from "./matchPosition";
import { MatchEventType } from "../../../constants";

export interface MatchEvent {
    type: MatchEventType;
    participantId: number;
    timestamp: number;

    eventType?: string;
    towerType?: string;
    teamId?: number;
    ascendedType?: string;
    killerId?: number;
    levelUpType?: string;
    pointCaptured?: string;
    assistingParticipantIds?: number[];
    wardType?: string;
    monsterType?: string;
    skillSlot?: number;
    victimId?: number;
    afterId?: number;
    monsterSubType?: string;
    laneType?: string;
    itemId?: number;
    buildingType?: string;
    creatorId?: number;
    position?: MatchPosition;
    beforeId?: number;
}