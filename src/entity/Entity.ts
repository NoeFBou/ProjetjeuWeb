// src/Meteor.ts

import { Sprite } from '../Sprite.ts';

export abstract class Entity {
    position: { x: number; y: number };
    speed: number;
    targetShadow: boolean;
    targetShadowPosition: { x: number; y: number };
    sprite: Sprite;
    size: number;
    isActive: boolean;
    canvasWidth: number;
    canvasHeight: number;


    constructor(canvasWidth: number, canvasHeight: number, sprite: Sprite, speed:number, size:number, position:{x:number,y:number}, hasShadow:boolean) {
        this.size = size;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.sprite = sprite;
        this.speed = speed
        this.position = {
            x: position.x,
            y: position.y
        };
        this.targetShadow = hasShadow;
        this.targetShadowPosition = {
            x: position.x,
            y: position.y
        };
        this.isActive = true;
    }

    abstract update(deltaTime: number): void;

    abstract draw(context: CanvasRenderingContext2D): void;

}
