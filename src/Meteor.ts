// src/Meteor.ts

import { Sprite } from './Sprite';

export class Meteor {
    position: { x: number; y: number };
    targetPosition: { x: number; y: number };
    speed: number;
    hasShadow: boolean;
    shadowPosition: { x: number; y: number };
    impactTime: number; // Temps restant avant l'impact en millisecondes
    sprite: Sprite;
    size: number;
    isActive: boolean;
    isFall: boolean;

    isGround: boolean;
    isGroundTime:number = 6000;


    constructor(canvasWidth: number, canvasHeight: number, sprite: Sprite) {
        this.size = 32;
        this.sprite = sprite;
        this.speed = 500; // Vitesse de chute en pixels par seconde

        // Position de départ aléatoire en haut du canvas
        this.position = {
            x: Math.random() * (canvasWidth - this.size),
            y: -this.size, // Commence en dehors du canvas
        };

        // Position d'impact aléatoire sur le canvas
        this.targetPosition = {
            x: Math.random() * (canvasWidth - this.size-16),
            y: Math.random() * (canvasHeight - this.size-16)
        };

        // Calcul de la durée de la chute basée sur la vitesse et la distance
        const distance = Math.hypot(
            this.targetPosition.x - this.position.x,
            this.targetPosition.y - this.position.y
        );
        this.impactTime = (distance / this.speed) * 1000; // en millisecondes

        this.hasShadow = false;
        this.shadowPosition = { x: this.targetPosition.x, y: this.targetPosition.y };
        this.isActive = true;
        this.isGround = false;
        this.isFall=true;
    }

    /**
     * Met à jour la position de la météorite et gère l'apparition de l'ombre.
     * @param deltaTime Le temps écoulé depuis la dernière mise à jour en millisecondes.
     */
    update(deltaTime: number): void {
        if (!this.isActive)
            return;
        else
            this.impactTime -= deltaTime;

        // Si le temps est inférieur ou égal à 2000 ms, afficher l'ombre
        if (this.isFall && this.impactTime <= 2000 && !this.hasShadow) {
            this.hasShadow = true;
        }

        if(this.isFall) {
            const totalTime = (Math.hypot(
                this.targetPosition.x - this.position.x,
                this.targetPosition.y - this.position.y
            ) / this.speed) * 1000;

            const progress = 1 - this.impactTime / totalTime;

            // Met à jour la position en fonction de la progression
            this.position.x = this.position.x + (this.targetPosition.x - this.position.x) * (deltaTime / this.impactTime);
            this.position.y = this.position.y + (this.targetPosition.y - this.position.y) * (deltaTime / this.impactTime);
        }

        if (this.isFall && this.impactTime <= 0) {
            this.hasShadow = false;
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
    }

    /**
     * Dessine la météorite et son ombre sur le canvas.
     * @param context Le contexte de rendu du canvas.
     */
    draw(context: CanvasRenderingContext2D): void {
        if (this.hasShadow) {
            // Dessine l'ombre (peut être une version plus sombre ou une ellipse)
            context.fillStyle = 'black';
            context.beginPath();
            context.ellipse(
                this.shadowPosition.x + this.size / 2,
                this.shadowPosition.y + this.size / 2,
                this.size / 2,
                this.size / 4,
                0,
                0,
                Math.PI * 2
            );
            context.fill();
        }

        if (this.isFall) {
            context.fillStyle="red";
            context.fillRect(this.position.x,this.position.y,this.size,this.size);
         //   this.sprite.render(context, this.position.x, this.position.y);
        }
        if (this.isGround){
            context.fillStyle = 'orange';
            context.beginPath();
            context.ellipse(
                this.shadowPosition.x + this.size ,
                this.shadowPosition.y + this.size ,
                this.size ,
                this.size / 2,
                0,
                0,
                Math.PI * 2
            );
            context.fill();
        }
    }

    /**
     * Indique si la météorite a atteint sa cible.
     * @returns Vrai si la météorite a impacté, sinon faux.
     */
    hasImpacted(): boolean {
        return this.isGround;
    }
}
