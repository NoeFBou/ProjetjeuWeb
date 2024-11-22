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

    abstract isPositionPassable(newX: number, newY: number): boolean;
}
