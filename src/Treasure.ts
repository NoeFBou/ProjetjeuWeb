import { Sprite } from './Sprite';

export class Treasure {
    public position: { x: number; y: number };
    public size: number;
    private _sprite: Sprite;

    constructor(sprite: Sprite, tileSize: number,x:number,y:number) {
        this._sprite = sprite;
        this.size = tileSize
        this.position = { x: x, y: y };
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._sprite.render(context, this.position.x, this.position.y);
    }

    public update(deltaTime: number) {
        this._sprite.update(deltaTime, 'static');

    }
}