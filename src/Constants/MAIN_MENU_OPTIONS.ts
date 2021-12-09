export enum MAIN_MENU_OPTIONS {
    Play,
    Rules,
    Exit
}

export type MainMenuOptions = keyof typeof MAIN_MENU_OPTIONS;