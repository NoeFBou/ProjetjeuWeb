// src/Tile.ts
import { Sprite } from './Sprite';

export class Tile {
    public position: { x: number; y: number };
    public isHole: boolean;
    public isPassable: boolean;
    public isTrap: boolean;
    public type:string;
    private _sprite: Sprite;
    //damageLevel: number;

    constructor(x: number, y: number, type: string, hole: boolean, isPassable: boolean, sprie: Sprite, isTrap: boolean) {
        this.position = { x, y };
        //this.damageLevel = 0;
        this.isHole = hole;
        this.type = type;
        this._sprite = sprie;
        this.isPassable = isPassable;
        this.isTrap = isTrap;
    }

    public update(deltaTime: number): void {

        this._sprite.update(deltaTime, 'static');

    }

    public draw(context: CanvasRenderingContext2D): void {
        this._sprite.render(context, this.position.x, this.position.y);


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
