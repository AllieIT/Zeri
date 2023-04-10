import { Champions, Items, RuneTree, SummonerSpells } from "../../models";

export interface DataDragonCache {
    champions: Champions | null;
    items: Items | null;
    summonerSpells: SummonerSpells | null;
    runesReforged: RuneTree[];
}