import {Sprite} from "./Sprite.ts";
import {CaraPlayer} from "./CaraPlayer.ts";
import {InputHandler} from "./InputHandler.ts";
import {LevelTreasureHunt} from "./LevelTreasureHunt.ts";
import {MenuState} from "./menu/MenuState.ts";
import {VictoryState} from "./VictoryState.ts";

export class Game {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    caraPlayer: CaraPlayer[];
    inputHandler : InputHandler;
    currentLevel! : any; //TODO: fix this
    direction: string[] = ['up', 'right', 'left', 'down-right', 'down-left', 'up-right',  'up-left', 'down'];
    levels: any[];
    currentLevelIndex: number;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D){
        this.canvas = canvas;
        this.ctx = context;
        this.caraPlayer = [];
        this.inputHandler = new InputHandler();
        this.currentLevel = new MenuState(this);
        this.levels = [];
        this.currentLevelIndex = 10;
        this.loadAndStart();

        //requestAnimationFrame(this.gameLoop.bind(this));
    }
    async loadAndStart() {
        const response = await fetch('src/assets/LevelData.json');
        this.levels = await response.json();
        this.currentLevel = new MenuState(this);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    addCaraPlayer(sprite : Sprite, key : string[]){
        this.caraPlayer.push(CaraPlayer.createCaraPlayer(sprite, key));
    }
    gameLoop(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.currentLevel.update(16);
        this.currentLevel.draw(this.ctx);
        requestAnimationFrame(this.gameLoop.bind(this));
    }


    start() {
        //requestAnimationFrame(this.gameLoop.bind(this));
       // this.currentLevel = new LevelTreasureHunt(this.caraPlayer,this);
    }

    startNewLevel() {
        const levelData = this.levels.levels[this.currentLevelIndex];
        if (!levelData) {
            // Si pas de niveau => tous terminés
            this.currentLevel = new VictoryState(this);
            return;
        }
        this.currentLevel = new LevelTreasureHunt(this.caraPlayer, this, levelData);
/*
        // Construire le niveau en fonction du type
        if (levelData.type === "TypeOne") {
            this.currentLevel = new LevelTypeOne(this.characters, this, levelData);
        } else {
            this.currentLevel = new LevelTypeTwo(this.characters, this, levelData);
        }*/
    }

    endCurrentLevel() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= 25) {
            this.currentLevel = new VictoryState(this);
        } else {
            this.startNewLevel();
        }
    }
}