export enum Region {
    BR = 'BR1',
    EUNE = 'EUN1',
    EUW = 'EUW1',
    KR = 'KR',
    LAN = 'LA1',
    LAS = 'LA2',
    NA = 'NA1',
    OCE = 'OC1',
    TR = 'TR1',
    RU = 'RU',
    JP = 'JP1',
    PH = 'PH2',
    SG = 'SG2',
    TH = 'TH2',
    VN = 'VN2',
    TW = 'TW2',
    PBE = 'PBE1',
}

export enum MacroRegion {
    AMERICAS = 'AMERICAS',
    ASIA = 'ASIA',
    EUROPE = 'EUROPE',
    SEA = 'SEA',
}

export function regionToMacroregion (region: Region): MacroRegion {
    const regionMap: { [key in any]: MacroRegion} = {
        BR1: MacroRegion.AMERICAS,
        EUN1: MacroRegion.EUROPE,
        EUW1: MacroRegion.EUROPE,
        JP1: MacroRegion.ASIA,
        KR: MacroRegion.ASIA,
        LA1: MacroRegion.AMERICAS,
        LA2: MacroRegion.AMERICAS,
        NA1: MacroRegion.AMERICAS,
        OC1: MacroRegion.SEA,
        RU: MacroRegion.EUROPE,
        TR1: MacroRegion.EUROPE,
        PH2: MacroRegion.SEA,
        SG2: MacroRegion.SEA,
        TH2: MacroRegion.SEA,
        VN2: MacroRegion.SEA,
        TW2: MacroRegion.ASIA,
    }

    if (region in regionMap)
        return regionMap[region];
    else throw new Error(`Region ${region} doesn't exist!`);
}