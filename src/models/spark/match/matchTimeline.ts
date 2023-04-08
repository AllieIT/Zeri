import { Metadata } from "./match";
import { MatchEvent } from "./matchEvent";
import { TimelineParticipantFrame } from "./participantFrame";

export interface MatchTimeline {
    /**
     * Match metadata
     */
    metadata: Metadata;
    /**
     * Match timeline info
     */
    info: TimelineInfo;
}

export interface TimelineInfo {
    frames: TimelineFrame[];
    frameInterval: number;
    gameId: number;
    participants: TimelineParticipant[];
}

export interface TimelineFrame {
    timestamp: number;
    participantFrames: ParticipantFrames;
    events: MatchEvent[];
}

export interface ParticipantFrames {
    [key: string]: TimelineParticipantFrame;
}

export interface TimelineParticipant {
    participantId: number;
    puuid: string;
}

