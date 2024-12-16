import {Entity} from "./Entity.ts";
import {Sprite} from "../Sprite.ts";

export class BoulleElectrique extends Entity{
    targetsPositions: [{ x: number; y: number }];
    nbPositions: number;
    numPosition: number;

    constructor(canvasWidth: number, canvasHeight: number,     targetsPositions: [{ x: number; y: number }], sprite : Sprite){
        super(canvasWidth, canvasHeight, sprite, 700, 29, {x: Math.random() * (canvasWidth - 29), y: -29}, true);
        this.targetsPositions = targetsPositions;
        this.nbPositions = targetsPositions.length;
        this.numPosition = 0;
    }

    update(deltaTime: number): void {
        if (this.isActive) {
            const target = this.targetsPositions[this.numPosition];
            const dirX = target.x - this.position.x;
            const dirY = target.y - this.position.y;
            const distance = Math.sqrt(dirX * dirX + dirY * dirY);

            const threshold = 15;

            if (distance < threshold) {
                this.numPosition = (this.numPosition + 1) % this.nbPositions;
            } else {
                const normX = dirX / distance;
                const normY = dirY / distance;
                this.position.x += normX * this.speed * (deltaTime / 1000);
                this.position.y += normY * this.speed * (deltaTime / 1000);
            }
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        this.sprite.render(context, this.position.x, this.position.y);
    }
}