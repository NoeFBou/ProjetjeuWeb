import { Sprite } from './Sprite';

export class Treasure {
    public position: { x: number; y: number };
    sprite: Sprite;
    size: number;

    constructor(sprite: Sprite, tileSize: number,x:number,y:number) {
        this.sprite = sprite;
        this.size = tileSize
        this.position = { x: x, y: y };
    }

    draw(context: CanvasRenderingContext2D): void {
        this.sprite.render(context, this.position.x, this.position.y);
    }

    update(deltaTime: number) {
        this.sprite.update(deltaTime, 'static');

    }
}