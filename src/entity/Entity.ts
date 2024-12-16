// src/Meteor.ts

import { Sprite } from '../Sprite.ts';

export abstract class Entity {
    public position: { x: number; y: number };
    public size: number;
    public isActive: boolean;
    protected _canvasWidth: number;
    protected _canvasHeight: number;
    protected _speed: number;
    protected _targetShadow: boolean;
    protected _targetShadowPosition: { x: number; y: number };
    protected _sprite: Sprite;

    constructor(canvasWidth: number, canvasHeight: number, sprite: Sprite, speed:number, size:number, position:{x:number,y:number}, hasShadow:boolean) {
        this.size = size;
        this._canvasWidth = canvasWidth;
        this._canvasHeight = canvasHeight;
        this._sprite = sprite;
        this._speed = speed
        this.position = {
            x: position.x,
            y: position.y
        };
        this._targetShadow = hasShadow;
        this._targetShadowPosition = {
            x: position.x,
            y: position.y
        };
        this.isActive = true;
    }

    public abstract update(deltaTime: number): void;

    public abstract draw(context: CanvasRenderingContext2D): void;

}
