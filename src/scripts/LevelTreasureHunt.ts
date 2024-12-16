// src/LevelTypeOne.ts

import { Level } from './Level.ts';
import { Game } from './Game.ts';
import { Treasure } from './Treasure.ts';
import { Meteor } from './entity/Meteor.ts';
import { Sprite } from './Sprite.ts';
import { Tile } from './Tile.ts';
import {CaraPlayer} from "./CaraPlayer.ts";
import {LightningAnimation} from "./entity/LightningAnimation.ts";
import {BoulleElectrique} from "./entity/BoulleElectrique.ts";
import { SerpentGeant } from './entity/SerpentGeant.ts';
import {Item} from "./entity/Item.ts";

export class LevelTreasureHunt extends Level {
    meteors: Meteor[];
    meteorTimer: number;
    meteorInterval: number;
    game: Game;
    tiles: Tile[][];
    tileSize: number;
    loading: boolean;
    grid: number[][];
    spriteTuile!: Sprite;
    meteorSprite!: Sprite;
    boullElectriqueSprite!: Sprite;
    treasure!: Treasure;

    meteorsStart: number;
    treasurePosition: { x: number; y: number };
    playerPosition:[{ x: number; y: number }];
    trapTiles: {x:number,y:number,interval:number,nextTime:number,"type": string,active:boolean,duration:number}[];
    effects: LightningAnimation[];
    electricBalls: BoulleElectrique[];
    serpentGeants: SerpentGeant[];
    items: Item[];

    constructor(characters: CaraPlayer[], game: Game, levelData: any) {
        super(characters);
        this.game = game;
        this.tiles = [];
        this.tileSize = levelData.tileSize;
        this.meteors = [];
        this.meteorTimer = 0;
        this.meteorInterval = levelData.meteorsFreq;
        this.loading = true;
        this.grid = levelData.grid;
        this.trapTiles = levelData.pieges;
        this.meteorsStart = levelData.meteorsStart;
        this.effects = [];
        this.electricBalls = [];
        this.items=[];

        const electricBalls = levelData.boulleElectrique;
        const itemP = levelData.items;

        this.initCharactersPosition(levelData.playerPosition );
        this.loadAssets(electricBalls,itemP);
        this.treasurePosition = { x:levelData.treasurePosition.x*64, y:levelData.treasurePosition.y*64 };
        this.playerPosition = levelData.playerPosition;
        this.serpentGeants = [];
        for (let i = 0; i < levelData.monstreGeant; i++) {
            this.serpentGeants.push(new SerpentGeant(Math.floor(Math.random() * (this.game.canvas.width - 128)), Math.floor(Math.random() * (this.game.canvas.height - 96))));
        }
    }


    public update(deltaTime: number): void {

        if (this.loading) return;

        // Met à jour le timer des météorites
        this.meteorTimer += deltaTime;
        if (this.meteorTimer > this.meteorInterval) {
            this.spawnMeteor(this.meteorSprite);
            this.meteorTimer = 0;
        }

        this.meteors.forEach((meteor) => meteor.update(deltaTime));
        this.electricBalls.forEach((ball) => ball.update(deltaTime));
        this.characters.forEach((character) => character.update(this.game.inputHandler, deltaTime,this));
        this.serpentGeants.forEach((serpent) => serpent.update(this.game.canvas.width-128, this.game.canvas.height-96));
        this.treasure.update(deltaTime);
        this.items.forEach(item => item.update(deltaTime));

        this.characters.forEach(character => {
            this.items.forEach(item => {
                if (this.checkCollision(character, item)) {
                    item.onPickup(character);
                }
            });
        });
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].update(deltaTime);
            }
        }
        for (let effect of this.effects) {
            effect.update(deltaTime);
        }
        this.effects = this.effects.filter(effect => !effect.finished);

        this.characters.forEach((character) => {
            if ( this.checkCollision(character, this.treasure)) {
                character.score++;
                this.game.endCurrentLevel();
            }
        });

        this.meteors.forEach((meteor) => {
            if (meteor.hasImpacted()) {
                this.characters.forEach((character) => {
                    if (this.checkCollision(character, meteor)) {
                        character.takeDamage(1);
                    }
                });
            }
        });
        this.meteors = this.meteors.filter((meteor) => meteor.isActive);

        this.electricBalls.forEach((ball) => {
            this.characters.forEach((character) => {
                if (this.checkCollision(character, ball)) {
                    character.takeDamage(1);
                }
            });
        })

        if (this.trapTiles)
            for (let i = 0; i < this.trapTiles.length; i++) {
                if (!this.trapTiles[i].active)
                    this.trapTiles[i].nextTime += deltaTime;
                if (!this.trapTiles[i].active && this.trapTiles[i].nextTime >= this.trapTiles[i].interval) {
                    this.trapTiles[i].active = true;
                    const lightning = new LightningAnimation(this.trapTiles[i].x*64, this.trapTiles[i].y*64);
                    this.effects.push(lightning);
                }
                if (this.trapTiles[i].active ) {
                    this.trapTiles[i].duration += deltaTime;
                    this.activateTraps(i);
                }
                if (this.trapTiles[i].active && this.trapTiles[i].duration>800  ) {
                    this.scheduleNextTrap(i);
                }
            }
        this.characters.forEach((character) => {
            if (this.isCaraFall(character.getPosition(), character.size/2)) {
                character.takeDamage(3);
            }
        });

        for (const character of this.characters) {
            for (const serpent of this.serpentGeants) {
                if (serpent.collidesWith(character)) {
                    character.takeDamage(2);
                }
            }

        }


    }

    public draw(context: CanvasRenderingContext2D): void {
        if (this.loading) {
            this.drawLoadingMessage(context, "Chargement...");
            return;
        }

        for (const row of this.tiles) {
            for (const tile of row) {
                tile.draw(context)
            }
        }
        this.meteors.forEach((meteor) => meteor.draw(context));

        this.treasure.draw(context);
        this.electricBalls.forEach((ball) => ball.draw(context));
        this.items.forEach(item => item.draw(context));

        this.characters.forEach((character) => character.draw(context));
        this.serpentGeants.forEach((serpent) => serpent.draw(context));
        this.drawScores(context);

        for (let effect of this.effects) {
            effect.draw(context);
        }
    }

    drawLoadingMessage(context: CanvasRenderingContext2D, message: string): void {
        const { width, height } = this.game.canvas;
        context.clearRect(0, 0, width, height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'white';
        context.font = '30px Arial';
        const textWidth = context.measureText(message).width;
        context.fillText(message, (width - textWidth) / 2, height / 2);
    }


    public drawScores(context: CanvasRenderingContext2D): void {
        context.fillStyle = 'white';
        context.font = '20px Arial';
        let yOffset = 50;
        this.characters.forEach((character, index) => {
            const score = character.score;
            context.fillText(`Joueur ${index + 1}:`,1290, yOffset);
            if (score === 0)
                context.fillText(` ${score} point`,1290, yOffset+40);
            else
                context.fillText(` ${score} points`,1290, yOffset+40);
            character.drawPanel(context, 1300, yOffset+50);
            yOffset += 180;
        });
    }

    public isPositionPassable(x: number, y: number, size :number): boolean {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                const tile = this.tiles[i][j];
                if (!tile.isPassable &&x < tile.position.x + 64 &&
                    x + size > tile.position.x &&
                    y < tile.position.y + 64 &&
                    size+ y > tile.position.y) {
                    return false;
                }
            }
        }
        return true;
    }


    public isCaraFall(position: { x: number; y: number }, size: number) {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].length; j++) {
                const tile = this.tiles[i][j];
                if (tile.isHole && position.x < tile.position.x +8+ 48 &&
                    position.x + size > tile.position.x+8 &&
                    position.y < tile.position.y+8 + 48 &&
                    size+ position.y > tile.position.y+8) {
                    return true;
                }
            }
        }
        return false;
    }

    private spawnMeteor(meteorSprite: Sprite): void {
        const meteor = new Meteor(20*64, 11*64, meteorSprite, this);
        this.meteors.push(meteor);
    }

    private initCharactersPosition(playerPosition: [{x:number,y:number}]): void {
        for (let i = 0; i < this.characters.length; i++) {
            this.characters[i].setPosition(playerPosition[i].x, playerPosition[i].y);
            this.characters[i].respawnPosition = { x: playerPosition[i].x, y: playerPosition[i].y }; // Pour respawn en cas d'impact
        }

    }

    private loadAssets(electricBalls: [{ x: number; y: number; waypoints: []; speed: number }], itemP: any):void{
        const treasureSprite = new Sprite('/assets/labo/portail.png', 6, 100, ['static']);
        const potionRouge = new Sprite('/assets/entity/potionrouge.png', 4, 100, ['static']);
        const potionBleu = new Sprite('/assets/entity/potionbleu.png', 4, 100, ['static']);

        this.meteorSprite = new Sprite('/assets/entity/potion.png', 4, 100, ['static']);
        this.spriteTuile = new Sprite('/assets/labo/tuile.png', 1, 100, ['static'])
        this.boullElectriqueSprite = new Sprite('/assets/entity/boulleElectrique.png', 8, 100, ['static']);
        let spriteLMur1 = new Sprite('/assets/labo/mur1.png', 1, 100, ['static']);
        let spriteLMur12 = new Sprite('/assets/labo/mur12.png', 1, 100, ['static']);
        let spriteLMur13 = new Sprite('/assets/labo/mur13.png', 1, 100, ['static']);
        let spriteLMur14 = new Sprite('/assets/labo/mur14.png', 1, 100, ['static']);
        let spriteLMur2 = new Sprite('/assets/labo/mur2.png', 1, 100, ['static']);
        let spriteLMur23 = new Sprite('/assets/labo/mur23.png', 1, 100, ['static']);
        let spriteLMur24 = new Sprite('/assets/labo/mur24.png', 1, 100, ['static']);
        let spriteLMur3 = new Sprite('/assets/labo/mur3.png', 1, 100, ['static']);
        let spriteLMur34 = new Sprite('/assets/labo/mur34.png', 1, 100, ['static']);
        let spriteLMur4 = new Sprite('/assets/labo/mur4.png', 1, 100, ['static']);
        let spriteLMur123 = new Sprite('/assets/labo/mur123.png', 1, 100, ['static']);
        let spriteLMur124 = new Sprite('/assets/labo/mur124.png', 1, 100, ['static']);
        let spriteLMur134 = new Sprite('/assets/labo/mur134.png', 1, 100, ['static']);
        let spriteLMur234 = new Sprite('/assets/labo/mur234.png', 1, 100, ['static']);
        let spriteLMur1234 = new Sprite('/assets/labo/mur1234.png', 1, 100, ['static']);
        let spriteLMur21 = new Sprite('/assets/labo/mur21.png', 1, 100, ['static']);
        let spriteLMur42 = new Sprite('/assets/labo/mur42.png', 1, 100, ['static']);
        let spriteLMur31 = new Sprite('/assets/labo/mur31.png', 1, 100, ['static']);
        let spriteLMur43 = new Sprite('/assets/labo/mur43.png', 1, 100, ['static']);
        let trou = new Sprite('/assets/labo/trou.png', 6, 10000, ['static']);
        let trou1 = new Sprite('/assets/labo/trou1.png', 6, 10000, ['static']);
        let trou2 = new Sprite('/assets/labo/trou2.png', 6, 10000, ['static']);
        let trou3 = new Sprite('/assets/labo/trou3.png', 6, 10000, ['static']);
        let trou4 = new Sprite('/assets/labo/trou4.png', 6, 10000, ['static']);
        let trou12 = new Sprite('/assets/labo/trou12.png', 6, 10000, ['static']);
        let trou13 = new Sprite('/assets/labo/trou13.png', 6, 10000, ['static']);
        let trou24 = new Sprite('/assets/labo/trou24.png', 6, 10000, ['static']);
        let trou34 = new Sprite('/assets/labo/trou34.png', 6, 10000, ['static']);
        let trou1234 = new Sprite('/assets/labo/trou1234.png', 6, 10000, ['static']);

        const dico :{ [key: string]: Sprite }= {
            1: spriteLMur1,
            2: spriteLMur2,
            3: spriteLMur3,
            4: spriteLMur4,
            12: spriteLMur12,
            13: spriteLMur13,
            14: spriteLMur14,
            23: spriteLMur23,
            24: spriteLMur24,
            34: spriteLMur34,
            123: spriteLMur123,
            124: spriteLMur124,
            134: spriteLMur134,
            234: spriteLMur234,
            1234: spriteLMur1234,
            21: spriteLMur21,
            42: spriteLMur42,
            31: spriteLMur31,
            43: spriteLMur43,
            10000: trou,
            10001: trou1,
            10002: trou2,
            10003: trou3,
            10004: trou4,
            10012: trou12,
            10013: trou13,
            10024: trou24,
            10034: trou34,
            10234: trou1234

        };
        const loadPromises: Promise<void>[] = [];
        loadPromises.push(this.spriteTuile.load());
        loadPromises.push(treasureSprite.load());
        loadPromises.push(this.meteorSprite.load());
        for (const key in dico) {
            loadPromises.push(dico[key].load());
        }
        Promise.all(loadPromises).then(() => {
            this.buildTiles(dico, this.spriteTuile);
            this.initCharactersPosition(this.playerPosition);
            this.treasure = new Treasure(treasureSprite, this.tileSize, this.treasurePosition.x, this.treasurePosition.y);

            for (let i = 0; i < this.meteorsStart; i++) {
                this.spawnMeteor(this.meteorSprite);
            }
            for (let i = 0; i < itemP.length; i++) {

                if (itemP[i].type === 'health')
                    this.items.push(new Item(20*64, 11*64,potionRouge, itemP[i].x,itemP[i].y, itemP[i].type));
                else
                    this.items.push(new Item(20*64, 11*64,potionBleu, itemP[i].x, itemP[i].y, itemP[i].type));
            }
            console.log(itemP);

            console.log(this.items);

            for (let i = 0; i < electricBalls.length; i++)
                this.electricBalls.push(
                    new BoulleElectrique(
                        electricBalls[i].x,
                        electricBalls[i].y,
                        electricBalls[i].waypoints,
                        electricBalls[i].speed,
                        this.boullElectriqueSprite
                    ));
            console.log(this.electricBalls);
            this.loading = false;
        }).catch(err => {
            console.error("Erreur lors du chargement des images: ", err);
        });
    }

    private activateTraps(i: number) {
        this.characters.forEach((character) => {
            if (character.getPosition().x < this.trapTiles[i].x*64 +16 + 32 &&
                character.getPosition().x + character.size > this.trapTiles[i].x*64 +16 &&
                character.getPosition().y < this.trapTiles[i].y*64 + 64 &&
                character.size+ character.getPosition().y > this.trapTiles[i].y*64)
                character.respawn()

        })
    }

    private buildTiles(dico: { [key: string]: Sprite }, spriteTuile: Sprite) {        //array 24 * 32 of 0

        this.tiles = [];
        for (let i = 0; i < 11; i++) {
            const row: Tile[] = [];
            for (let j = 0; j < 20  ; j++) {
                const val = this.grid[i][j];
                const isTrap = this.trapTiles ? this.trapTiles.some(t => t.x === j && t.y === i) : false;

                if (val==0)
                    row.push(new Tile(j * 64, i * 64, "sol", false, true, spriteTuile, isTrap));
                else if (val>=10000)
                    row.push(new Tile(j * 64, i * 64, "trou", true, true, dico[val], isTrap));
                else
                    row.push(new Tile(j * 64, i * 64, "mur", false, false, dico[val],isTrap));

            }
            this.tiles.push(row);
        }

    }

    private scheduleNextTrap(i: number) {
        this.trapTiles[i].active = false;
        this.trapTiles[i].duration=0;
        if (this.trapTiles[i].type != 'fixe') {
            this.trapTiles[i].interval = Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
        }
        this.trapTiles[i].nextTime=0;
    }
}
