import {Zeri} from '../src';
import {config} from "dotenv";
import {Division, Queue, Region, Tier} from "../src/constants";

config({ path: __dirname + '/.env'})

const key = process.env.RIOT_API_KEY!;
const zeri = new Zeri({
    key: key,
    debug: {
        logUrls: false
    }
});

for (let i = 0; i < 250; i++) {
    zeri.league.getEntriesByDivision(Region.LAS, Queue.RANKED_SOLO_5x5, Tier.GOLD, Division.I).then(r => console.log("Got response" + JSON.stringify(r).slice(0, 30)));
    zeri.league.getEntriesByDivision(Region.LAN, Queue.RANKED_SOLO_5x5, Tier.GOLD, Division.I).then(r => console.log("Got response" + JSON.stringify(r).slice(0, 30)));
}