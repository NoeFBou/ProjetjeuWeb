export class PlayerConfig {
    skin: string;
    keys: string[];
    ready: boolean;

    constructor(skin: string, keys: string[]) {
        this.skin = skin;
        this.keys = keys;
        this.ready = false;
    }
}
