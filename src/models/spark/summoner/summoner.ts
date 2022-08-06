export interface Summoner {
    /**
     * Encrypted account ID. Max length 56 characters.
     */
    readonly accountId: string;
    /**
     * ID of the summoner icon associated with the summoner.
     */
    readonly profileIconId: number;
    /**
     * Date summoner was last modified specified as epoch milliseconds.
     * The following events will update this timestamp: profile icon change, playing the tutorial or advanced tutorial, finishing a game, summoner name change.
     */
    readonly revisionDate: number;
    /**
     * Summoner name.
     */
    readonly name: string;
    /**
     * Encrypted summoner ID. Max length 63 characters.
     */
    readonly id: string;
    /**
     * 	Encrypted PUUID. Exact length of 78 characters.
     */
    readonly puuid: string;
    /**
     * 	Summoner level associated with the summoner.
     */
    readonly summonerLevel: number
}