import { Sprite } from './Sprite';
import { Tile } from './Tile';

export class Treasure {
    public position: { x: number; y: number };
    sprite: Sprite;
    size: number;

    constructor(sprite: Sprite, tiles: Tile[][], tileSize: number) {
        this.sprite = sprite;
        this.size = tileSize / 2; // Ajustez selon la taille de votre sprite
        this.position = { x: 0, y: 0 };
        this.randomizePosition(tiles, tileSize);
    }

    /**
     * Positionne le trésor à un emplacement aléatoire sur les tuiles disponibles.
     * @param tiles La grille de tuiles du niveau.
     * @param tileSize La taille d'une tuile.
     */
    randomizePosition(tiles: Tile[][], tileSize: number): void {
        const rows = tiles.length;
        const cols = tiles[0].length;


        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);
        console.log(cols)
        const tile = tiles[randomRow][cols-1];
        console.log(tile)

        if (!tile.isHole) {
            this.position = {
                x: tile.position.x + tileSize / 2 - this.size / 2,
                y: tile.position.y + tileSize / 2 - this.size / 2,
            };

        }
        console.log(tile.position)

    }

    /**
     * Dessine le trésor sur le canvas.
     * @param context Le contexte de rendu du canvas.
     */
    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle="green";
        context.fillRect(this.position.x,this.position.y,32,32);
        //this.sprite.render(context, this.position.x, this.position.y);
    }
}