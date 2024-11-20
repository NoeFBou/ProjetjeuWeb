// src/LevelTypeOne.ts

import { Level } from './Level';
import { Game } from './Game.ts';
import { Treasure } from './Treasure';
import { Meteor } from './Meteor';
import { Sprite } from './Sprite';
import { Tile } from './Tile';
import {CaraPlayer} from "./CaraPlayer.ts";

export class LevelTreasureHunt extends Level {
    treasure: Treasure;
    meteors: Meteor[];
    meteorTimer: number;
    meteorInterval: number;
    game: Game;
    tiles: Tile[][];
    tileSize: number;

    constructor(characters: CaraPlayer[], game: Game) {
        super(characters);
        this.game = game;
        this.tiles = [];
        /*
        for (let i = 0; i < 24; i++) {
            const row : Tile[]=[];
            for (let j = 0; j < 43; j++) {
                row.push( new Tile(j*32,i*32));
            }
            this.tiles.push(row);
        }*/
        this.initTuile();
        this.tileSize = 32;
        this.meteors = [];
        this.meteorTimer = 0;
        this.meteorInterval = 150;

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

        this.characters.forEach((character) => character.update(this.game.inputHandler, deltaTime));

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
     * Vérifie s'il y a une collision entre un personnage et un objet.
     * @param character Le personnage à vérifier.
     * @param obj L'objet avec lequel vérifier la collision.
     * @returns Vrai si une collision est détectée, sinon faux.
     */
    checkCollision(character: CaraPlayer, obj: { position: { x: number; y: number }; size: number }): boolean {
        const distance = Math.hypot(character.position.x - obj.position.x, character.position.y - obj.position.y);
        return distance < (character.size + obj.size) / 2;
    }

    /**
     * Dessine les scores des joueurs sur le canvas.
     * @param context Le contexte de rendu du canvas.
     */
    drawScores(context: CanvasRenderingContext2D): void {
        context.fillStyle = 'red';
        context.font = '20px Arial';
        let yOffset = 20;
        this.characters.forEach((character, index) => {
            const score = character.score;
            context.fillText(`Joueur ${index + 1}: ${score} points`, 10, yOffset);
            yOffset += 25;
        });
    }

    initTuile(): number[][]{
        //array 24 * 32 of 0
        let ddddddd = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1 ],
            [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1 ],
            [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1 ]
        ];
        this.tiles = [];
        for (let i = 0; i < 24; i++) {
            const row : Tile[]=[];
            for (let j = 0; j < 40; j++) {
                console.log(ddddddd[i][j])
                if (ddddddd[i][j]==1) {
                    row.push(new Tile(j * 32, i * 32, "green"));
                }
                else
                    row.push( new Tile(j*32,i*32,"grey"));
            }
            this.tiles.push(row);
        }


        return ddddddd;
    }
}
