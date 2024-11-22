import {Sprite} from "./Sprite.ts";
import {CaraPlayer} from "./CaraPlayer.ts";
import {InputHandler} from "./InputHandler.ts";
import {Level} from "./Level.ts";
import {LevelTreasureHunt} from "./LevelTreasureHunt.ts";
import {LevelSurvive} from "./LevelSurvive.ts";

export class Game {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    caraPlayer: CaraPlayer[];
    inputHandler : InputHandler;
    currentLevel : Level;
    //diagonal_
    direction: string[] = ['up', 'right', 'left', 'down-right', 'down-left', 'up-right',  'up-left', 'down'];

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D){
        this.canvas = canvas;
        this.ctx = context;
        this.caraPlayer = [];
        this.inputHandler = new InputHandler();

       // this.startNewLevel();

        requestAnimationFrame(this.gameLoop.bind(this));
        this.addCaraPlayer(
            new Sprite('src/assets/skin/gluant.png', 9, 100, this.direction), ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);
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
        this.currentLevel = new LevelTreasureHunt(this.caraPlayer,this);
    }

    startNewLevel() {
        const levelType = Math.random() < 0.5 ? 'TypeOne' : 'TypeTwo';
        if (levelType === 'TypeOne') {
            this.currentLevel = new LevelTreasureHunt(this.caraPlayer, this);
        } else {
            this.currentLevel = new LevelSurvive(this.caraPlayer, this);
        }
    }
}