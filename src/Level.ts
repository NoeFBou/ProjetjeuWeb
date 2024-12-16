// src/Level.ts

import { CaraPlayer } from './CaraPlayer';

export abstract class Level {
    characters: CaraPlayer[];

    constructor(characters: CaraPlayer[]) {
        this.characters = characters;
    }




    /**
     * Met à jour l'état du niveau.
     * @param deltaTime Temps écoulé depuis la dernière mise à jour en millisecondes.
     */
    abstract update(deltaTime: number): void;

    /**
     * Dessine le niveau sur le canvas.
     * @param context Le contexte de rendu du canvas.
     */
    abstract draw(context: CanvasRenderingContext2D): void;

    abstract isPositionPassable(newX: number, newY: number,size:number): boolean;
    abstract isCaraFall(position: { x: number; y: number }, size: number): boolean;

    drawScores(context: CanvasRenderingContext2D) {
        context.fillStyle = 'black';
        context.font = '20px Arial';
        let yOffset = 20;
        this.characters.forEach((character, index) => {
            const score = character.score;
            context.fillText(`Joueur ${index + 1}: ${score} points`, 10, yOffset);
            yOffset += 25;
        });
    }

    checkCollision(character: CaraPlayer, obj: { position: { x: number; y: number }; size: number }): boolean {
        const {x, y} = character.getPosition();
        const distance = Math.hypot(x - obj.position.x, y - obj.position.y);
        return distance < (character.size + obj.size) / 2;
    }


}
