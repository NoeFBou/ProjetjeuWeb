import {Entity} from "./Entity.ts";
import {Sprite} from "../Sprite.ts";

export class BoulleElectrique extends Entity{
    waypoints: {x: number; y: number}[];
    currentWaypointIndex: number;


    constructor(canvasWidth: number, canvasHeight: number, waypoints: {x: number; y: number}[], speed: number, sprite : Sprite){
        super(canvasWidth, canvasHeight, sprite, speed, 32, { x: waypoints[0].x, y: waypoints[0].y }, true);
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;
    }

    update(deltaTime: number) {
        const target = this.waypoints[this.currentWaypointIndex];
        const dx = target.x - this.position.x;
        const dy = target.y - this.position.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 5) {
            this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length;
        } else {
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * this.speed * (deltaTime / 16.67);
            const moveY = Math.sin(angle) * this.speed * (deltaTime / 16.67);
            this.position.x += moveX;
            this.position.y += moveY;
        }

        this.sprite.update(deltaTime, 'static');
    }

    draw(context: CanvasRenderingContext2D) {
        this.sprite.render(context, this.position.x, this.position.y);
    }
}