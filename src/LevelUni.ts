// src/LevelTypeOne.ts

import { Level } from './Level';
import { Game } from './Game.ts';
import { Treasure } from './Treasure';
import { Meteor } from './entity/Meteor.ts';
import { Sprite } from './Sprite';
import { Tile } from './Tile';
import {CaraPlayer} from "./CaraPlayer.ts";

export class LevelTreasureHunt extends Level {
    treasure: Treasure;
    meteors: Meteor[];
    meteorTimer: number = 0;
    meteorInterval: number;
    game: Game;
    tiles: Tile[][];
    tileSize: number = 32;

    constructor(characters: CaraPlayer[], game: Game, meteorInterval: number, tuile : Tile[][]) {
        super(characters);
        this.game = game;
        this.tiles = tuile;

        this.meteors = [];

        this.meteorInterval = meteorInterval;

        this.initTuile();
        this.initCharactersPosition();

        const treasureSprite = new Sprite('assets/images/treasure.png', 1, 1000, ['static']);
        this.treasure = new Treasure(treasureSprite, this.tiles, this.tileSize);
        for (let i = 0; i < 20; i++) {
            this.spawnMeteor();

        }
    }

    /**
     * Initialise les positions des personnages.
     */
    initCharactersPosition(): void {
        const centerX = 0;
        const centerY = this.game.canvas.height / 2 - this.tileSize / 2;
        this.characters.forEach((character) => {
            character.position = { x: centerX, y: centerY };
            character.respawnPosition = { x: centerX, y: centerY }; // Pour respawn en cas d'impact
        });
    }

    /**
     * Met à jour le niveau en gérant les météorites et les interactions des joueurs.
     * @param deltaTime Le temps écoulé depuis la dernière mise à jour en millisecondes.
     */
    update(deltaTime: number): void {
        // Met à jour le timer des météorites
        this.meteorTimer += deltaTime;
        if (this.meteorTimer > this.meteorInterval) {
            this.spawnMeteor();
            this.meteorTimer = 0;
        }

        this.meteors.forEach((meteor) => meteor.update(deltaTime));

        this.characters.forEach((character) => character.update(this.game.inputHandler, deltaTime,this));

        this.characters.forEach((character) => {
            if ( this.checkCollision(character, this.treasure)) {
                character.score++;
                this.game.startNewLevel();
            }
        });

        this.meteors.forEach((meteor) => {
            if (meteor.hasImpacted()) {
                this.characters.forEach((character) => {
                    if (!character.getIsRespawn() && this.checkCollision(character, meteor)) {
                        character.respawn(); // Implémentez une méthode de respawn dans Character
                    }
                });
            }
        });

        this.meteors = this.meteors.filter((meteor) => meteor.isActive);
    }

    /**
     * Dessine le niveau, y compris le trésor, les météorites et les personnages.
     * @param context Le contexte de rendu du canvas.
     */
    draw(context: CanvasRenderingContext2D): void {

        for (const row of this.tiles) {
            for (const tile of row) {
                tile.draw(context)
            }
        }
        this.meteors.forEach((meteor) => meteor.draw(context));

        this.treasure.draw(context);

        this.characters.forEach((character) => character.draw(context));

        this.drawScores(context);
    }

    /**
     * Crée et ajoute une nouvelle météorite au niveau.
     */
    spawnMeteor(): void {
        const meteorSprite = new Sprite('assets/images/meteor.png', 1, 1000, ['static']);
        const meteor = new Meteor(this.game.canvas.width, this.game.canvas.height, meteorSprite);
        this.meteors.push(meteor);
    }


    /**
     * Dessine les scores des joueurs sur le canvas.
     * @param context Le contexte de rendu du canvas.
     */


    initTuile(): number[][]{
        //array 24 * 32 of 0

    }

    isPositionPassable(x: number, y: number): boolean {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        if (this.tiles[tileY] && this.tiles[tileY][tileX]) {
            return this.tiles[tileY][tileX].isPassable;
        }
        return false;
    }

}
