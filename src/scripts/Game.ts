import {Sprite} from "./Sprite.ts";
import {CaraPlayer} from "./CaraPlayer.ts";
import {LevelTreasureHunt} from "./LevelTreasureHunt.ts";
import {MenuState} from "./menu/MenuState.ts";
import {VictoryState} from "./VictoryState.ts";
import {InputHandler} from "./InputHandler.ts";

export class Game {

    canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    caraPlayer: CaraPlayer[];
    private currentLevel! : any; //TODO: fix this
    private levels: any[];
    private currentLevelIndex: number;
    public inputHandler: InputHandler;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D){
        this.canvas = canvas;
        this.ctx = context;
        this.caraPlayer = [];
        this.currentLevel = new MenuState(this);
        this.levels = [];
        this.currentLevelIndex = 0;
        this.inputHandler = new InputHandler();


/*        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            console.log("x: " + x + " y: " + y);
        });*/
        this.loadAndStart();


    }

    addCaraPlayer(sprite : Sprite, key : string[]){
        this.caraPlayer.push(CaraPlayer.createCaraPlayer(sprite, key));
    }

    async loadAndStart() {
        const response = await fetch('/assets/data/LevelData.json');
        this.levels = await response.json();
        this.currentLevel = new MenuState(this);
        requestAnimationFrame(this.gameLoop.bind(this));
    }



    gameLoop(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.currentLevel.update(16);
        this.currentLevel.draw(this.ctx);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    startNewLevel() {
        // @ts-ignore
        const levelData = this.levels.levels[this.currentLevelIndex];


        if (!levelData) {
            this.currentLevel = new VictoryState(this);
            return;
        }
        this.currentLevel = new LevelTreasureHunt(this.caraPlayer, this, levelData);

    }

    endCurrentLevel() {
        this.currentLevelIndex++;
        const select = document.getElementById('levelSelect') as HTMLSelectElement;

        select.value = this.currentLevelIndex.toString();



        if (this.currentLevelIndex >= 25) {
            this.currentLevel = new VictoryState(this);
        } else {
            this.startNewLevel();
        }
    }

    populateLevelSelect() {
        const select = document.getElementById('levelSelect') as HTMLSelectElement;
        if (!select) return;

        select.innerHTML = '';

        // @ts-ignore
        this.levels.levels.forEach((levelData, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.textContent = `Niveau ${levelData.id || (index+1)}`;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            const selectedIndex = parseInt(target.value, 10);
            if (!isNaN(selectedIndex)) {
                this.loadLevel(selectedIndex);
            }
        });
    }

    loadLevel(index: number) {
        this.currentLevelIndex = index;
        this.startNewLevel();
    }
}