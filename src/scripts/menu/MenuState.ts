import {Game} from "../Game.ts";
import {MainMenu} from "./MainMenu.ts";
import {PlayerConfigMenu} from "./PlayerConfigMenu.ts";
import {PlayerConfig} from "./PlayerConfig.ts";
import {Sprite} from "../Sprite.ts";

export class MenuState {
    game: Game;
    currentStep: 'main' | 'playersAllAtOnce' | 'validation';
    numberOfPlayers: number;
    currentPlayerIndex: number;
    playerConfigs: PlayerConfig[];
    mainMenu: MainMenu;
    playerMenus: PlayerConfigMenu[];
    errorMessage: string;
    direction: string[] = ['up', 'right', 'left', 'down-right', 'down-left', 'up-right',  'up-left', 'down'];

    constructor(game: Game) {
        this.game = game;
        this.currentStep = 'main';
        this.mainMenu = new MainMenu();
        this.playerConfigs = [];
        this.playerMenus = [];
        this.currentPlayerIndex = 0;
        this.errorMessage = '';
        this.numberOfPlayers = 1;
    }

    update(deltaTime: number) {
        if (this.currentStep === 'main') {
            this.mainMenu.update(deltaTime,this.game.inputHandler);
            if (this.mainMenu.isConfirmed) {
                this.numberOfPlayers = this.mainMenu.selectedPlayers;
                for (let i = 0; i < this.numberOfPlayers; i++) {
                    const defaultSkin = `gluant.png`;
                    const defaultKeys = this.getDefaultKeysForPlayer(i);
                    this.playerConfigs.push(new PlayerConfig(defaultSkin, defaultKeys));
                    this.playerMenus.push(new PlayerConfigMenu(this.playerConfigs[i], i+1));
                }
                this.currentStep = 'playersAllAtOnce';
            }
        } else if (this.currentStep === 'playersAllAtOnce') {
            for (let i = 0; i < this.numberOfPlayers; i++) {
                const pm = this.playerMenus[i];
                const playerKeys = this.playerConfigs[i].keys;
                pm.update(deltaTime, this.game.inputHandler, playerKeys);
            }

            if (this.playerMenus.every(pm => pm.isReady)) {
                this.currentStep = 'validation';
            }
        } else if (this.currentStep === 'validation') {
            if (this.isValidConfiguration()) {
                for (let i = 0; i < this.numberOfPlayers; i++) {
                    const pm = this.playerMenus[i];
                    this.game.addCaraPlayer(
                        new Sprite(`/assets/skin/${pm.playerConfig.skin}`, 9, 100, this.direction),
                        pm.playerConfig.keys);
                }
                this.game.populateLevelSelect();

                this.game.startNewLevel();
            } else {
                this.errorMessage = "Skins ou touches en doublon, veuillez changer vos configurations!";
                for (let pm of this.playerMenus) {
                    pm.isReady = false;
                    pm.playerConfig.ready = false;
                }
                this.currentStep = 'playersAllAtOnce';
            }
        }
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.currentStep === 'main') {
            this.mainMenu.draw(context);
        } else if (this.currentStep === 'playersAllAtOnce') {
            context.fillStyle = 'black';
            context.fillRect(0,0,this.game.canvas.width,this.game.canvas.height);
            context.fillStyle = 'white';
            context.font = '20px Arial';
            context.fillText(`Entrée pour valider.`, 100, 30);

            const spacing = 300;
            for (let i = 0; i < this.numberOfPlayers; i++) {
                context.save();
                context.translate(50 + i * spacing, 50);
                this.playerMenus[i].draw(context);
                context.restore();
            }
            if (this.errorMessage !== '') {
                context.fillStyle = 'red';
                context.font = '20px Arial';
                context.fillText(this.errorMessage, 100, 30);
            }
        } else if (this.currentStep === 'validation') {
            context.fillStyle = 'black';
            context.fillRect(0,0,this.game.canvas.width,this.game.canvas.height);
            context.fillStyle = 'red';
            context.font = '30px Arial';
            context.fillText(this.errorMessage, 50, 100);
        }
    }

    isValidConfiguration(): boolean {
        const skins = this.playerConfigs.map(p => p.skin);
        const uniqueSkins = new Set(skins);
        if (uniqueSkins.size < skins.length) return false;

        const keysArr = this.playerConfigs.map(p => p.keys.join(','));
        const uniqueKeys = new Set(keysArr);
        if (uniqueKeys.size < keysArr.length) return false;

        return true;
    }

    getDefaultKeysForPlayer(playerIndex: number): string[] {
        const defaultCombos = [
            ['q','d','z','s'],
            ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'],
            ['4','6','8','5'],
            ['j','l','i','k'],
            ['f','h','t','g'],
            ['m','*','^','ù']
        ];
        return defaultCombos[playerIndex];
    }
}
