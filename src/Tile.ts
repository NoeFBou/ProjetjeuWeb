// src/Tile.ts
import { Sprite } from './Sprite';

export class Tile {
    position: { x: number; y: number };
    damageLevel: number;
    isHole: boolean;
    sprite: Sprite;
    type:string;
    isPassable: boolean;
    isTrap: boolean;

    constructor(x: number, y: number, type: string, hole: boolean, isPassable: boolean, sprie: Sprite, isTrap: boolean) {
        this.position = { x, y };
        this.damageLevel = 0;
        this.isHole = hole;
        this.type = type;
        this.sprite = sprie;
        this.isPassable = isPassable;
        this.isTrap = isTrap;
    }

    update(deltaTime: number): void {

        this.sprite.update(deltaTime, 'static');

    }

    draw(context: CanvasRenderingContext2D): void {
        this.sprite.render(context, this.position.x, this.position.y);


    }

    /*
    damage(): void {
        this.damageLevel += 1;
        if (this.damageLevel >= 3) {
            this.isHole = true;
            // Changez le sprite pour représenter un trou si nécessaire
        }
    }
    repair(): void {
        if (this.damageLevel > 0) {
            this.damageLevel -= 1;
            if (this.damageLevel < 3) {
                this.isHole = false;
            }
        }
    }*/
}
