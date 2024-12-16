import {Game} from "./Game.ts";

export class VictoryState {
    private _game: Game;
    private winner: { index: number; score: number };

    constructor(game: Game) {
        this._game = game;
        this.winner = this.findTopScorer();
    }

    findTopScorer(): { index: number; score: number } {
        let topScore = -Infinity;
        let topIndex = 0;

        this._game.caraPlayer.forEach((character, index) => {
            if (character.score > topScore) {
                topScore = character.score;
                topIndex = index;
            }
        });

        return { index: topIndex, score: topScore };
    }

    update() {

    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'black';
        context.fillRect(0,0,this._game.canvas.width,this._game.canvas.height);
        context.fillStyle = 'white';
        context.font = '40px Arial';
        context.fillText("Victoire et Merci !", 100, 100);

        const winnerIndex = this.winner.index + 1; // +1 si vous voulez afficher "Joueur 1" au lieu de "Joueur 0"
        const winnerScore = this.winner.score;
        context.font = '30px Arial';
        context.fillText(`Le gagnant est le Joueur ${winnerIndex} avec ${winnerScore} points !`, 100, 200);
    }
}
