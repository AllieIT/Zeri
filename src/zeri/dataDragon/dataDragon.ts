import { Champion, Champions, Item, Items, RuneTree, SparkParams, SummonerSpell, SummonerSpells } from "../../models";
import { Heimerdinger } from "../../heimerdinger/heimerdinger";
import { ItemKind, StaticConstants } from "../../constants";
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
        this._cache = {
            champions: null,
            items: null,
            summonerSpells: null,
            runesReforged: []
        }
    }

    async init() {
        if (!this._initialized) {
            const versions = await this._axiosSpark.get<string[]>(StaticConstants.DATA_DRAGON_VERSION_URL);
            this._version = versions.data[0];
            this._cache = {
                champions: await this.getChampions(),
                items: await this.getItems(),
                summonerSpells: await this.getSummonerSpells(),
                runesReforged: await this.getRunesReforged()
            }

            this._initialized = true;
        }
    }

    async getSummonerSpells() {
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/summoner.json`;

        if (!this._initialized)
            return this._baseDataDragonRequest<SummonerSpells>(PATH);

        return this._cache.summonerSpells!;
    }

    async getItems() {
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/item.json`;

        if (!this._initialized)
            return this._baseDataDragonRequest<Items>(PATH);

        return this._cache.items!;
    }

    async getChampions(): Promise<Champions> {
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/champion.json`;

        if (!this._initialized)
            return this._baseDataDragonRequest<Champions>(PATH);

        return this._cache.champions!;
    }

    async getRunesReforged(): Promise<RuneTree[]> {
        const PATH = `https://ddragon.leagueoflegends.com/cdn/${this._version}/data/${this._language}/runesReforged.json`;

        if (!this._initialized)
            return this._baseDataDragonRequest<RuneTree[]>(PATH);

        return this._cache.runesReforged!;
    }

    private async _baseDataDragonRequest<T>(path: string): Promise<T> {
        const res = await this._axiosSpark.get<T>(path);
        return res.data;
    }

    getChampionById(id: string): Champion {
        if (!this._initialized)
            throw new Error("Data Dragon not initialized. Please Initialize Data Dragon Spark first using zeri.initDataDragon()");

        for (const key in this._cache.champions!.data) {
            if (this._cache.champions!.data[key].key === id)
                return this._cache.champions!.data[key];
        }
        throw new Error(`Champion with id ${id} doesn't exist!`);
    }

    getSummonerSpellById(id: string): SummonerSpell {
        if (!this._initialized)
            throw new Error("Data Dragon not initialized. Please Initialize Data Dragon Spark first using zeri.initDataDragon()");

        for (const key in this._cache.summonerSpells!.data) {
            if (this._cache.summonerSpells!.data[key].key === id)
                return this._cache.summonerSpells!.data[key];
        }
        throw new Error(`Summoner Spell with id ${id} doesn't exist!`);
    }

    getItemById(id: string): Item {
        if (!this._initialized)
            throw new Error("Data Dragon not initialized. Please Initialize Data Dragon Spark first using zeri.initDataDragon()");

        for (const key in this._cache.items!.data) {
            if (key === id)
                return this._cache.items!.data[key];
        }
        throw new Error(`Item with id ${id} doesn't exist!`);
    }

    getItemKindById(id: string): ItemKind {
        const item = this.getItemById(id);
        if (item === null)
            return ItemKind.Unknown;

        if (item.description.includes("Mythic"))
            return ItemKind.Mythic;

        if (item.tags.includes("Boots"))
            return ItemKind.Boots;

        // Array containing all league of legends legendary items
        // see https://leagueoflegends.fandom.com/wiki/Legendary_item
        // for more information
        const legendaryItemNames = [
            "Abyssal Mask",
            "Anathema's Chains",
            "Archangel's Staff",
            "Ardent Censer",
            "Axiom Arc",
            "Banshee's Veil",
            "Black Cleaver",
            "Black Mist Scythe",
            "Blade of the Ruined King",
            "Bloodthirster",
            "Bulwark of the Mountain",
            "Chempunk Chainsword",
            "Chemtech Putrifier",
            "Cosmic Drive",
            "Dead man's Plate",
            "Death's Dance",
            "Demonic Embrace",
            "Edge of Night",
            "Essence Reaver",
            "Fimbulwinter",
            "Force of Nature",
            "Frozen Heart",
            "Gargoyle Stoneplate",
            "Guardian Angel",
            "Guinsoo's Rageblade",
            "Horizon Focus",
            "Hullbreaker",
            "Infinity Edge",
            "Knight's Vow",
            "Lich Bane",
            "Lord Dominik's Regards",
            "Manamune",
            "Maw of Malmortius",
            "Mejai's Soulstealer",
            "Mercurial Scimitar",
            "Mikael's Blessing",
            "Morellonomicon",
            "Mortal Reminder",
            "Muramana",
            "Nashor's Tooth",
            "Navori Quickblades",
            "Pauldrons of Whiterock",
            "Phantom Dancer",
            "Rabadon's Deathcap",
            "Randuin's Omen",
            "Rapid Firecannon",
            "Ravenous Hydra",
            "Redemption",
            "Runaan's Hurricane",
            "Rylai's Crystal Scepter",
            "Seraph's Embrace",
            "Serpent's Fang",
            "Serylda's Grudge",
            "Shadowflame",
            "Shard of True Ice",
            "Silvermere Dawn",
            "Spear of Shojin",
            "Spirit Visage",
            "Staff of Flowing Water",
            "Sterak's Gage",
            "Stormrazor",
            "Sunfire Aegis",
            "The Collector",
            "Thornmail",
            "Titanic Hydra",
            "Turbo Chemtank",
            "Umbral Glaive",
            "Vigilant Wardstone",
            "Void Staff",
            "Warmog's Armor",
            "Winter's Approach",
            "Wit's End",
            "Youmuu's Ghostblade",
            "Zeke's Convergence",
            "Zhonya's Hourglass",
        ]

        if (legendaryItemNames.includes(item.name))
            return ItemKind.Legendary;

        return ItemKind.Unknown;
    }
}