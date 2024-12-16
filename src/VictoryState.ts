import {Game} from "./Game.ts";

export class VictoryState {
    game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    update(deltaTime: number) {

    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'black';
        context.fillRect(0,0,this.game.canvas.width,this.game.canvas.height);
        context.fillStyle = 'white';
        context.font = '40px Arial';
        context.fillText("Victoire et Merci !", 100, 100);
    }
}
