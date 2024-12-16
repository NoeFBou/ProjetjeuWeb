// src/Level.ts

import { CaraPlayer } from './CaraPlayer';

export abstract class Level {
    characters: CaraPlayer[];

    constructor(characters: CaraPlayer[]) {
        this.characters = characters;
    }

    abstract update(deltaTime: number): void;

    abstract draw(context: CanvasRenderingContext2D): void;

    abstract isPositionPassable(newX: number, newY: number,size:number): boolean;

    abstract isCaraFall(position: { x: number; y: number }, size: number): boolean;

    abstract drawScores(context: CanvasRenderingContext2D): void;

    checkCollision(character: CaraPlayer, obj: { position: { x: number; y: number }; size: number }): boolean {
        const {x, y} = character.getPosition();
        const distance = Math.hypot(x - obj.position.x, y - obj.position.y);
        return distance < (character.size + obj.size) / 2;
    }


}
