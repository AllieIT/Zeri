import { Champion, Champions, Item, Items, RuneTree, SparkParams, SummonerSpell, SummonerSpells } from "../../models";
import { Heimerdinger } from "../../heimerdinger/heimerdinger";
import { StaticConstants } from "../../constants";
import axios, { AxiosInstance } from "axios";
import { DataDragonCache } from "./cache";

export class DataDragonSpark {

    private _logger: Heimerdinger;
    private _params: SparkParams;
    private _version: string;
    private readonly _language: string;
    private readonly _axiosSpark: AxiosInstance;
    private _initialized: boolean;
    private _cache: DataDragonCache;
    private _cached: boolean;

    constructor(params: SparkParams) {
        this._logger = new Heimerdinger('Spark');
        this._params = params;
        this._axiosSpark = axios.create({
            headers: {
                'X-Riot-Token': this._params.key
            }
        });

        this._language = "en_US";
        this._version = "...";
        this._initialized = false;
        this._cached = false;
        this._cache = {
            champions: null,
            items: null,
            summonerSpells: null,
            runesReforged: []
        }

        this.init().then(async () => {
            // this._logger.log(`Data Dragon Spark initialized on version ${this._version}`)
            this._cache = {
                champions: await this.getChampions(),
                items: await this.getItems(),
                summonerSpells: await this.getSummonerSpells(),
                runesReforged: await this.getRunesReforged()
            }
            this._cached = true;
        });
    }

    async init() {
        if (!this._initialized) {
            const versions = await this._axiosSpark.get<string[]>(StaticConstants.DATA_DRAGON_VERSION_URL);
            this._version = versions.data[0];
            this._initialized = true;
        }
    }

    async getSummonerSpells() {
        await this.init();
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/summoner.json`;
        if (this._cached)
            return this._cache.summonerSpells!;
        return this._baseDataDragonRequest<SummonerSpells>(PATH);
    }

    async getItems() {
        await this.init();
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/item.json`;
        if (this._cached)
            return this._cache.items!;
        return this._baseDataDragonRequest<Items>(PATH);
    }

    async getChampions(): Promise<Champions> {
        await this.init();
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/champion.json`;
        if (this._cached)
            return this._cache.champions!;
        return this._baseDataDragonRequest<Champions>(PATH);
    }

    async getRunesReforged(): Promise<RuneTree[]> {
        await this.init();
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/runesReforged.json`;
        if (this._cached)
            return this._cache.runesReforged!;
        return this._baseDataDragonRequest<RuneTree[]>(PATH);
    }

    private async _baseDataDragonRequest<T>(path: string): Promise<T> {
        const res = await this._axiosSpark.get<T>(path);
        return res.data;
    }

    getChampionById(id: string): Champion | null {
        if (!this._cached)
            return null;

        for (const key in this._cache.champions!.data) {
            if (this._cache.champions!.data[key].key === id)
                return this._cache.champions!.data[key];
        }
        return null;
    }

    getSummonerSpellById(id: string): SummonerSpell | null {
        if (!this._cached)
            return null;

        for (const key in this._cache.summonerSpells!.data) {
            if (this._cache.summonerSpells!.data[key].key === id)
                return this._cache.summonerSpells!.data[key];
        }
        return null;
    }

    getItemById(id: string): Item | null {
        if (!this._cached)
            return null;

        for (const key in this._cache.items!.data) {
            if (key === id)
                return this._cache.items!.data[key];
        }
        return null;
    }
}