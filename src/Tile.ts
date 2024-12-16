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

    /**
     * Applique des dégâts à la tuile.
     */
    damage(): void {
        this.damageLevel += 1;
        if (this.damageLevel >= 3) {
            this.isHole = true;
            // Changez le sprite pour représenter un trou si nécessaire
        }
    }
    update(deltaTime: number): void {

        this.sprite.update(deltaTime, 'static');

    }



    /**
     * Répare la tuile en diminuant son niveau de dégâts.
     */
    repair(): void {
        if (this.damageLevel > 0) {
            this.damageLevel -= 1;
            if (this.damageLevel < 3) {
                this.isHole = false;
            }
        }
    }

    /**
     * Dessine la tuile sur le canvas.
     * @param context Le contexte de rendu du canvas.
     */
    draw(context: CanvasRenderingContext2D): void {
        this.sprite.render(context, this.position.x, this.position.y);


    }
}
