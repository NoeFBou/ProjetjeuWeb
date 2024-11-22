// src/Tile.ts

import { Sprite } from './Sprite';

export class Tile {
    position: { x: number; y: number };
    damageLevel: number;
    isHole: boolean;
    sprite: Sprite;
    type:string;
    isPassable: boolean;

    constructor(x: number, y: number,type:string, hole:boolean=false,isPassable: boolean = true) {
        this.position = { x, y };
        this.damageLevel = 0;
        this.isHole = hole;
        this.type = type;
        this.sprite = new Sprite('assets/images/tileset.png', 1, 1000, ['normal']);
        this.isPassable = isPassable;
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



    /**
     * Répare la tuile en diminuant son niveau de dégâts.
     */
    repair(): void {
        if (this.damageLevel > 0) {
            this.damageLevel -= 1;
            if (this.damageLevel < 3) {
                this.isHole = false;
                // Changez le sprite pour représenter une tuile réparée si nécessaire
            }
        }
    }

    /**
     * Dessine la tuile sur le canvas.
     * @param context Le contexte de rendu du canvas.
     */
    draw(context: CanvasRenderingContext2D): void {

        context.fillStyle = this.type;
        context.fillRect(this.position.x, this.position.y, 32, 32)

       // this.sprite.render(context, this.position.x, this.position.y);
    }
}
