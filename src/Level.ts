import {Game} from "./Game.ts";
import {CaraPlayer} from "./CaraPlayer.ts";

export abstract class Level {
    protected characters: CaraPlayer[];
    protected game: Game;

    constructor(characters: CaraPlayer[], game: Game) {
        this.characters = characters;
        this.game = game;
    }

    /**
     * Méthode abstraite pour mettre à jour l'état du niveau.
     * Doit être implémentée par les classes dérivées.
     */
    abstract update(deltaTime: number): void;

    /**
     * Méthode abstraite pour dessiner le niveau à l'écran.
     * Doit être implémentée par les classes dérivées.
     */
    abstract draw(context: CanvasRenderingContext2D): void;
}
