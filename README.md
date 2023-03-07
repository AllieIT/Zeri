# Zeri
Riot API Wrapper for League of Legends created from scratch using TypeScript. Its main purpose is to provide game data from all regions for future applications using data from League of Legends matches.
It currently allows to make calls for League v4, Match v5, Summoner v4 and Data Dragon endpoints and is planned to provide data from all of the endpoints specified in current version of Riot API.
Zeri implements a simple rate limiter which halts API calls after exceeding a specific method / application limits specified by Riot API, preventing it from crashing or giving empty results.

## Installation

Zeri is currently published on npm registry on website https://www.npmjs.com/package/zeri and can be installed just like all other packages using `npm install zeri`. Afterwards, import and create a Zeri instance by providing your API token, which is available on https://developer.riotgames.com/ website.

## Example code
```javascript
import { Zeri } from "zeri";
import { Constants } from "zeri";

const zeri = new Zeri("<Your Riot API key goes here>");

// Print summoner names of players currently ranked Gold I in EUNE region in Solo/Duo Queue

zeri.league.getEntriesByDivision(
    Constants.Region.EUNE, 
    Constants.Queue.RANKED_SOLO_5x5,
    Constants.Tier.GOLD,
    Constants.Division.I,
    2
).then(results => results.forEach(leagueEntry => {
    console.log(leagueEntry.summonerName);
}));