import {Game} from "./Game.ts";

export class VictoryState {
    private _game: Game;

    constructor(game: Game) {
        this._game = game;
    }

    update() {

    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'black';
        context.fillRect(0,0,this._game.canvas.width,this._game.canvas.height);
        context.fillStyle = 'white';
        context.font = '40px Arial';
        context.fillText("Victoire et Merci !", 100, 100);
    }
}
