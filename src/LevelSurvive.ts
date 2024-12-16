import {Level} from "./Level.ts";
import {Tile} from "./Tile.ts";
import {Game} from "./Game.ts";
import {CaraPlayer} from "./CaraPlayer.ts";

export class LevelSurvive extends Level {

    tiles: Tile[][];
    tileSize: number;
    damageTimer: number;
    regenerationTimer: number;
    game: Game;
    eliminatedPlayers: Set<CaraPlayer>;
    levelDuration: number;

    constructor(characters: CaraPlayer[], game: Game) {
        super(characters);
        this.game = game;
        this.tileSize = 32; // Taille d'une case
        this.tiles = this.generateTiles();
        this.damageTimer = 0;
        this.regenerationTimer = 0;
        this.eliminatedPlayers = new Set();
        this.levelDuration = 0;
        this.initCharactersPosition();
    }

    generateTiles(): Tile[][] {
        const rows = Math.floor(this.game.canvas.height / this.tileSize);
        const cols = Math.floor(this.game.canvas.width / this.tileSize);
        const tiles: Tile[][] = [];

        for (let y = 0; y < rows; y++) {
            const row: Tile[] = [];
            for (let x = 0; x < cols; x++) {
                row.push(new Tile(x * this.tileSize, y * this.tileSize, "grey", undefined, undefined, undefined, isTrap));
            }
            tiles.push(row);
        }
        return tiles;
    }

    initCharactersPosition() {
        this.characters.forEach((character) => {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * this.tiles[0].length);
                const y = Math.floor(Math.random() * this.tiles.length);
                if (!this.tiles[y][x].isHole) {
                    character.position = { x: x * this.tileSize, y: y * this.tileSize };
                    placed = true;
                }
            }
        });
    }

    update(deltaTime: number) {
        this.levelDuration += deltaTime;
        this.damageTimer += deltaTime;
        this.regenerationTimer += deltaTime;

        if (this.damageTimer > 2000) {
            this.damageTiles();
            this.damageTimer = 0;
        }

        if (this.levelDuration > 30000 && this.regenerationTimer > 10000) {
            this.regenerateTiles();
            this.regenerationTimer = 0;
        }

        this.characters.forEach((character) => {
            if (!this.eliminatedPlayers.has(character)) {
                character.update(this.game.inputHandler, deltaTime,this);
                this.checkPlayerPosition(character);
            }
        });

        this.eliminatePlayers();

        if (this.characters.length - this.eliminatedPlayers.size <= 1) {
            const winner = this.characters.find((char) => !this.eliminatedPlayers.has(char));
            if (winner) {
                winner.score += 1;
            }
            this.game.startNewLevel();
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.tiles.forEach((row) => {
            row.forEach((tile) => tile.draw(context));
        });

        this.characters.forEach((character) => {
            if (!this.eliminatedPlayers.has(character)) {
                character.draw(context);
            }
        });

        this.drawScores(context);
    }

    damageTiles() {
        this.characters.forEach((character) => {
            const tile = this.getTileUnderCharacter(character);
            if (tile && !tile.isHole) {
                tile.damage();
            }
        });
    }

    regenerateTiles() {
        const holes = this.getHoles();
        const candidates: any[] = [];

        holes.forEach((hole) => {
            const neighbors = this.getNeighborTiles(hole);
            if (neighbors.some((tile) => !tile.isHole)) {
                candidates.push(hole);
            }
        });

        if (candidates.length > 0) {
            const tileToRepair = candidates[Math.floor(Math.random() * candidates.length)];
            tileToRepair.repair();
        }
    }

    eliminatePlayers() {
        this.characters.forEach((character) => {
            if (!this.eliminatedPlayers.has(character)) {
                const tile = this.getTileUnderCharacter(character);
                if (tile && tile.isHole) {
                    this.eliminatedPlayers.add(character);
                }
            }
        });
    }

    checkPlayerPosition(character: CaraPlayer) {
// Empêcher le joueur de sortir des limites ou de marcher sur des trous
        const tile = this.getTileUnderCharacter(character);
        if (tile && tile.isHole) {
// Le joueur est sur un trou, il sera éliminé lors de l'appel à eliminatePlayers()
        }
    }

    getTileUnderCharacter(character: CaraPlayer): Tile | null {
        const x = Math.floor(character.position.x / this.tileSize);
        const y = Math.floor(character.position.y / this.tileSize);
        if (this.tiles[y] && this.tiles[y][x]) {
            return this.tiles[y][x];
        }
        return null;
    }

    getHoles(): Tile[] {
        const holes: Tile[] = [];
        this.tiles.forEach((row) => {
            row.forEach((tile) => {
                if (tile.isHole) {
                    holes.push(tile);
                }
            });
        });
        return holes;
    }

    getNeighborTiles(tile: Tile): Tile[] {
        const neighbors: Tile[] = [];
        const x = tile.position.x / this.tileSize;
        const y = tile.position.y / this.tileSize;

        const positions = [
            { x: x - 1, y },
            { x: x + 1, y },
            { x, y: y - 1 },
            { x, y: y + 1 },
        ];

        positions.forEach((pos) => {
            if (this.tiles[pos.y] && this.tiles[pos.y][pos.x]) {
                neighbors.push(this.tiles[pos.y][pos.x]);
            }
        });

        return neighbors;
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
