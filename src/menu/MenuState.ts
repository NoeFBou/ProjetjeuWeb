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
            this.mainMenu.update(this.game.inputHandler);
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
            // Mettre à jour chaque menu joueur en même temps
            for (let i = 0; i < this.numberOfPlayers; i++) {
                const pm = this.playerMenus[i];
                // pm.update prend maintenant aussi le set de touches du joueur
                const playerKeys = this.playerConfigs[i].keys;
                pm.update(deltaTime, this.game.inputHandler, playerKeys);
            }

            // Vérifier si tous les joueurs sont prêts
            if (this.playerMenus.every(pm => pm.isReady)) {
                // Passer à la validation
                this.currentStep = 'validation';
            }
        } else if (this.currentStep === 'validation') {
            if (this.isValidConfiguration()) {
                for (let i = 0; i < this.numberOfPlayers; i++) {
                    const pm = this.playerMenus[i];
                    this.game.addCaraPlayer(
                        new Sprite(`../src/assets/skin/${pm.playerConfig.skin}`, 9, 100, this.direction),
                        pm.playerConfig.keys);
                }
                this.game.startNewLevel();
            } else {
                this.errorMessage = "Skins ou touches en doublon, veuillez changer vos configurations!";
                // Rester dans cet état ou donner l’opportunité de revenir au menu joueurs
            }
        }
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.currentStep === 'main') {
            this.mainMenu.draw(context);
        } else if (this.currentStep === 'playersAllAtOnce') {
            context.fillStyle = 'black';
            context.fillRect(0,0,this.game.canvas.width,this.game.canvas.height);

            // Afficher tous les menus joueurs simultanément
            const spacing = 300; // espace horizontal entre chaque menu
            for (let i = 0; i < this.numberOfPlayers; i++) {
                context.save();
                context.translate(50 + i * spacing, 50);
                this.playerMenus[i].draw(context);
                context.restore();
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
        // Même logique qu'avant
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
            ['l','j','k','i'],
            ['h','f','g','t'],
            ['*','m','ù','t'],
            ['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'],
            ['6','4','5','8']
        ];
        return defaultCombos[playerIndex];
    }
}
