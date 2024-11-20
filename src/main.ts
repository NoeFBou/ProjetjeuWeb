import {Game} from "./Game.ts";

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
        console.error('2D context not available!');
        return;
    }

    const game = new Game(canvas, context);

    game.start();
});
