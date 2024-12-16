import { Entity } from "./Entity.ts";
import { Sprite } from "../Sprite.ts";

export class SerpentGeant extends Entity {
    velocity: { x: number; y: number };

    constructor(canvasWidth: number, canvasHeight: number, sprite: Sprite) {
        super(
            canvasWidth,
            canvasHeight,
            sprite,
            200,
            100,
            { x: canvasWidth / 2, y: canvasHeight / 2 }, // Position initiale au centre
            false // Pas d'ombre pour cet exemple
        );

        // Initialiser la vélocité avec une direction aléatoire
        const angle = Math.random() * 2 * Math.PI;
        this.velocity = {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed
        };
    }

    update(deltaTime: number): void {
        if (this.isActive) {
            this.position.x += this.velocity.x * (deltaTime / 1000);
            this.position.y += this.velocity.y * (deltaTime / 1000);

            if (this.position.x <= 0) {
                this.position.x = 0;
                this.velocity.x *= -1;
            } else if (this.position.x + this.size >= this.canvasWidth) {
                this.position.x = this.canvasWidth - this.size;
                this.velocity.x *= -1;
            }

            if (this.position.y <= 0) {
                this.position.y = 0;
                this.velocity.y *= -1;
            } else if (this.position.y + this.size >= this.canvasHeight) {
                this.position.y = this.canvasHeight - this.size;
                this.velocity.y *= -1;
            }
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        this.sprite.render(context, this.position.x, this.position.y);
    }
}
