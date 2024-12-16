// src/Meteor.ts

import { Sprite } from '../Sprite.ts';
import {Entity} from "./Entity.ts";
import {Level} from "../Level.ts";

export class Meteor  extends Entity  {
    targetPosition: { x: number; y: number };
    targetShadow: boolean;
    targetShadowPosition: { x: number; y: number };
    impactTime: number;
    isFall: boolean;
    spritePoison: Sprite;
    spriteTarget: Sprite;

    isGround: boolean;
    isGroundTime:number = 6000;


    constructor(canvasWidth: number, canvasHeight: number, sprite: Sprite, Level: Level) {
        super(canvasWidth, canvasHeight, sprite, 500, 32, {x: Math.random() * (canvasWidth - 32), y: -32}, true);
        this.spritePoison = new Sprite('src/assets/entity/poison.png', 6, 100, ['static']);
        this.spriteTarget = new Sprite('src/assets/entity/target.png', 8, 50, ['static']);

        this.targetPosition = { x: 0, y: 0 };
        const maxAttempts = 100;
        let attempts = 0;
        let validPositionFound = false;

        while (!validPositionFound && attempts < maxAttempts) {
            const targetx = Math.random() * (canvasWidth - this.size - 16);
            const targety = Math.random() * (canvasHeight - this.size - 16);

            if (Level.isPositionPassable(targetx, targety, this.size) && !Level.isCaraFall({ x: targetx, y: targety }, this.size)) {
                this.targetPosition = {
                    x: targetx,
                    y: targety
                };
                validPositionFound = true;
            }

            attempts++;
        }


        if (!validPositionFound) {
            this.targetPosition = { x: 0, y: 0 };
        }

        const distance = Math.hypot(
            this.targetPosition.x - this.position.x,
            this.targetPosition.y - this.position.y
        );
        this.impactTime = (distance / this._speed) * 1000; // en millisecondes

        this.targetShadow = false;
        this.targetShadowPosition = { x: this.targetPosition.x, y: this.targetPosition.y };
        this.isActive = true;
        this.isGround = false;
        this.isFall=true;
    }

    update(deltaTime: number): void {
        if (!this.isActive)
            return;
        else
            this.impactTime -= deltaTime;

        if (this.isFall && this.impactTime <= 2000 && !this.targetShadow) {
            this.targetShadow = true;
        }

        if(this.isFall) {
            const totalTime = (Math.hypot(
                this.targetPosition.x - this.position.x,
                this.targetPosition.y - this.position.y
            ) / this._speed) * 1000;

            const progress = 1 - this.impactTime / totalTime;

            // Met à jour la position en fonction de la progression
            this.position.x = this.position.x + (this.targetPosition.x - this.position.x) * (deltaTime / this.impactTime);
            this.position.y = this.position.y + (this.targetPosition.y - this.position.y) * (deltaTime / this.impactTime);
        }

        if (this.isFall && this.impactTime <= 0) {
            this.targetShadow = false;
            this.isFall = false;
            this.isGround=true;
            this.size /=2;
        }


        if (this.isGround){
            this.isGroundTime-=deltaTime;
        }

        if (this.isGround && this.isGroundTime <= 0) {
            this.isGround=false;
            this.isActive=false;
        }
        this._sprite.update(deltaTime, 'static');
        this.spritePoison.update(deltaTime, 'static');
        this.spriteTarget.update(deltaTime, 'static');
    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.targetShadow) {
            this.spriteTarget.render(context, this.targetPosition.x, this.targetPosition.y);
        }

        if (this.isFall) {
            this._sprite.render(context, this.position.x, this.position.y);
        }
        if (this.isGround){
            this.spritePoison.render(context, this.position.x, this.position.y);
        }
    }

    hasImpacted(): boolean {
        return this.isGround;
    }
}
