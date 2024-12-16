import {InputHandler} from "../InputHandler.ts";

export class MainMenu {
    selectedPlayers: number;
    isConfirmed: boolean;

    constructor() {
        this.selectedPlayers = 1;
        this.isConfirmed = false;
    }

    update(inputHandler: InputHandler) {
        if (inputHandler.isKeyPressed('ArrowLeft')) {
            this.selectedPlayers = Math.max(1, this.selectedPlayers - 1);
        }
        if (inputHandler.isKeyPressed('ArrowRight')) {
            this.selectedPlayers = Math.min(4, this.selectedPlayers + 1);
        }
        if (inputHandler.isKeyPressed('Enter')) {
            this.isConfirmed = true;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'white';
        context.font = '30px Arial';
        context.fillText(`Sélectionnez le nombre de joueurs: ${this.selectedPlayers}`, 100, 100);
        context.fillText(`Utilisez Gauche/Droite pour changer, Entrée pour valider.`, 100, 150);
    }
}
