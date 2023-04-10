import { DataDragonImage } from "../image";

export interface SummonerSpells {
    type: string;
    version: string;
    data: Record<string, SummonerSpell>;
}

export interface SummonerSpell {
    id: string;
    name: string;
    description: string;
    tooltip: string;
    maxrank: number;
    cooldown: number[];
    cooldownBurn: string;
    cost: number[];
    costBurn: string;
    dataValues: any;
    effect: number | null[][];
    effectBurn: string | null[];
    vars: any[];
    key: string;
    summonerLevel: number;
    modes: string[];
    costType: string;
    maxammo: string;
    range: number[];
    rangeBurn: string;
    image: DataDragonImage;
    resource: string;
}