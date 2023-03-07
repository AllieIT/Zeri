import { Participant } from "./participant";

export interface Match {
    /**
     * Match metadata
     */
    metadata: Metadata;
    /**
     * Match info
     */
    info: Info;
}

export interface Metadata {
    /**
     * Match data version
     */
    dataVersion: string;
    /**
     * Match id
     */
    matchId: string;
    /**
     * List of participant PUUIDs
     */
    participants: string[];
}

export interface Info {
    /**
     * Unix timestamp for when the game is created on the game server (i.e., the loading screen)
     */
    gameCreation: number;
    /**
     * Field containing max timePlayed of any participant in the game in seconds
     */
    gameDuration: number;
    /**
     * Unix timestamp for when match ends on the game server
     */
    gameEndTimestamp: number;
    gameId: number;
    /**
     * Reference https://static.developer.riotgames.com/docs/lol/gameModes.json
     */
    gameMode: string;
    gameName: string;
    /**
     * Unix timestamp for when match starts on the game server
     */
    gameStartTimestamp: number;
    gameType: string;
    /**
     * 	The first two parts can be used to determine the patch a game was played on
     */
    gameVersion: string;
    /**
     * Reference https://static.developer.riotgames.com/docs/lol/maps.json
     */
    mapId: number;
    participants: Participant[]
    /**
     * Platform where the match was played
     */
    platformId: string;
    /**
     * Reference https://static.developer.riotgames.com/docs/lol/queues.json
     */
    queueId: number;
    teams: Team[];
    /**
     * 	Tournament code used to generate the match
     */
    tournamentCode: string;
}

export interface Team {
    bans: Ban[];
    objectives: Objectives;
    teamId: number;
    win: boolean;
}

export interface Ban {
    championId: number;
    pickTurn: number;
}

export interface Objectives {
    baron: Objective
    champion: Objective
    dragon: Objective
    inhibitor: Objective
    riftHerald: Objective
    tower: Objective
}

export interface Objective {
    first: boolean;
    kills: number;
}
