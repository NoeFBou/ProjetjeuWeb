import {Entity} from "./Entity.ts";
import {CaraPlayer} from "../CaraPlayer.ts";
import {Sprite} from "../Sprite.ts";

export class Item extends Entity {
    private isAvailable: boolean;
    private timeSincePicked: number;
    private respawnTimer: number;
    private type: string;

    constructor(canvasWidth: number, canvasHeight: number, sprite: Sprite, x: number, y: number, type: string) {
        super(canvasWidth, canvasHeight, sprite, 0, 32, { x: x, y: y }, true);
        this.type = type;
        this.isAvailable = true;
        this.respawnTimer = 4000; // 5 s
        this.timeSincePicked = 0;

    }

    update(deltaTime: number) {
        if (!this.isAvailable) {
            this.timeSincePicked += deltaTime;
            if (this.timeSincePicked >= this.respawnTimer) {
                this.isAvailable = true;
                this.timeSincePicked = 0;
            }
        }
        this._sprite.update(deltaTime, 'static');

    }

    draw(context: CanvasRenderingContext2D) {
        if (this.isAvailable)
            this._sprite.render(context, this.position.x, this.position.y);

    }

    onPickup(character: CaraPlayer) {
        if (!this.isAvailable) {
            return;
        }
        if (this.type === 'health') {
            character.lives = 3;
        } else if (this.type === 'invincibility') {
            character.startInvincibility(4000);
        }

        this.isAvailable = false;
        this.timeSincePicked = 0;
    }
}