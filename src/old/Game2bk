import {Sprite} from "./Sprite.ts";
import {CaraPlayer} from "./CaraPlayer.ts";
import {InputHandler} from "./InputHandler.ts";

export class Game {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    caraPlayer: CaraPlayer[];
    inputHandler : InputHandler;
    lastTime: number;
    //diagonal_
    direction: string[] = ['up', 'right', 'left', 'down-right', 'down-left', 'up-right',  'up-left', 'down'];

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D){
        this.canvas = canvas;
        this.ctx = context;
        this.caraPlayer = [];
        this.inputHandler = new InputHandler();
        this.lastTime = 0;

        requestAnimationFrame(this.gameLoop.bind(this));
        this.addCaraPlayer(
            new Sprite('src/assets/skin/gluant.png', 9, 100, this.direction), ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);
    }

    addCaraPlayer(sprite : Sprite, key : string[]){
        this.caraPlayer.push(CaraPlayer.createCaraPlayer(sprite, key));
    }
    gameLoop(timestamp: number){
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }


    private update(deltaTime: number)  {

        for (let cara of this.caraPlayer) {
            cara.update(this.inputHandler ,deltaTime);
        }

    }

    private draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let cara of this.caraPlayer) {
            cara.draw(this.ctx);
        }
    }

    start() {
        requestAnimationFrame(this.gameLoop.bind(this));

    }

    startNewLevel() {

    }
}