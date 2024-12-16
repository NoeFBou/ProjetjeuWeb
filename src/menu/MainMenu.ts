import {InputHandler} from "../InputHandler.ts";

export class MainMenu {
    selectedPlayers: number;
    isConfirmed: boolean;
    navigationCooldown: number;
    timeSinceLastNav: number;

    constructor() {
        this.selectedPlayers = 1;
        this.isConfirmed = false;

        this.navigationCooldown = 300;
        this.timeSinceLastNav = 0;
    }

    update(deltaTime: number,inputHandler: InputHandler) {
        this.timeSinceLastNav += deltaTime;

        if (inputHandler.isKeyPressed('ArrowUp') && this.timeSinceLastNav > this.navigationCooldown) {
            this.selectedPlayers = Math.min(4, this.selectedPlayers + 1);
            this.timeSinceLastNav = 0;
        }
        if (inputHandler.isKeyPressed('ArrowDown') && this.timeSinceLastNav > this.navigationCooldown) {
            this.selectedPlayers = Math.max(1, this.selectedPlayers - 1);
            this.timeSinceLastNav = 0;
        }
        if (inputHandler.isKeyPressed('Enter')) {
            this.isConfirmed = true;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'white';
        context.font = '30px Arial';
        context.fillText(`Sélectionnez le nombre de joueurs: ${this.selectedPlayers}`, 100, 100);
        context.fillText(`Utilisez Haut/Bas pour changer, Entrée pour valider.`, 100, 150);
    }
}
