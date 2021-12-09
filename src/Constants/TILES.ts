export interface ITile {
    name: string,
    icon: string,
    hidden: boolean
}

export interface ITiles {
    [key: string]: ITile
}

export const TILES: ITiles = {
    "sword" :   { "name": "sword",  "icon": "⚔️",   "hidden": false},
    "crown" :   { "name": "crown",  "icon": "👑",   "hidden": false},
    "shield":   { "name": "shield", "icon": "🛡️",    "hidden": false},
    "horse" :   { "name": "horse",  "icon": "🐴",   "hidden": false},
    "hammer":   { "name": "hammer", "icon": "🔨",   "hidden": false},
    "scale" :   { "name": "scale",  "icon": "⚖️",   "hidden": false},
    "flag"  :   { "name": "flag",   "icon": "🚩",   "hidden": false}
}