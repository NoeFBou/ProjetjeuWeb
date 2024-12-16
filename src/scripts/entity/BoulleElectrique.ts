import {Entity} from "./Entity.ts";
import {Sprite} from "../Sprite.ts";

export class BoulleElectrique extends Entity{
    private _waypoints: {x: number; y: number}[];
    private _currentWaypointIndex: number;


    constructor(canvasWidth: number, canvasHeight: number, waypoints: {x: number; y: number}[], speed: number, sprite : Sprite){
        super(canvasWidth, canvasHeight, sprite, speed, 32, { x: waypoints[0].x, y: waypoints[0].y }, true);
        this._waypoints = waypoints;
        this._currentWaypointIndex = 0;
    }

    public update(deltaTime: number) {
        const target = this._waypoints[this._currentWaypointIndex];
        const dx = target.x - this.position.x;
        const dy = target.y - this.position.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 5) {
            this._currentWaypointIndex = (this._currentWaypointIndex + 1) % this._waypoints.length;
        } else {
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * this._speed * (deltaTime / 16.67);
            const moveY = Math.sin(angle) * this._speed * (deltaTime / 16.67);
            this.position.x += moveX;
            this.position.y += moveY;
        }

        this._sprite.update(deltaTime, 'static');
    }

    public draw(context: CanvasRenderingContext2D) {
        this._sprite.render(context, this.position.x, this.position.y);
    }
}