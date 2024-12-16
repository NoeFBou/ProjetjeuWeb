// Dans PlayerConfigMenu
import {InputHandler} from "../InputHandler.ts";
import {PlayerConfig} from "./PlayerConfig.ts";

export class PlayerConfigMenu {
    playerConfig: PlayerConfig;
    playerNumber: number;
    categories: string[];
    selectedCategoryIndex: number;
    availableSkins: string[];
    availableKeySets: string[][];
    isReady: boolean;

    // Propriétés pour l’animation du skin
    frameIndex: number;
    frameCount: number;
    frameInterval: number;
    timeSinceLastFrame: number;
    frameWidth: number;
    frameHeight: number;

    skinImage: HTMLImageElement;
    skinImageLoaded: boolean;
    navigationCooldown: number;
    timeSinceLastNav: number;

    constructor(playerConfig: PlayerConfig, playerNumber: number) {
        this.playerConfig = playerConfig;
        this.playerNumber = playerNumber;
        this.categories = ["Skin", "Touches", "Prêt"];
        this.selectedCategoryIndex = 0;
        this.availableSkins = ["gluant.png", "gluant bleufonce.png", "gluant gris.png", "gluant jaune.png",
            "gluant orange.png", "gluant rose.png", "gluant rouge.png", "gluant vert.png"];
        // `../src/assets/skin/${skinPath}`,

        this.availableKeySets = [
            ['q','d','z','s'],
            ["j","l","i","k"],
            ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"],
            ["4","6","8","5"]
        ];
        this.isReady = false;

        // Initialisation des variables d’animation
        this.frameIndex = 0;
        this.frameCount = 9; // Nombre de frames dans la ligne du sprite
        this.frameInterval = 100; // Temps (en ms) entre chaque frame
        this.timeSinceLastFrame = 0;
        this.frameWidth = 64; // Largeur d’une frame
        this.frameHeight = 64; // Hauteur d’une frame

        this.skinImage = new Image();
        this.skinImageLoaded = false;
        this.loadSkinImage(this.playerConfig.skin);
        this.navigationCooldown = 300; // 300 ms entre deux navigations verticales
        this.timeSinceLastNav = 0;
    }

    loadSkinImage(skinPath: string) {
        this.skinImage.src = `../src/assets/skin/${skinPath}`;
        this.skinImage.onload = () => {
            this.skinImageLoaded = true;
        }
    }

    update(deltaTime: number, inputHandler: InputHandler, playerKeys: string[]) {
        this.timeSinceLastNav += deltaTime;

        // Navigation entre catégories
        if (inputHandler.isKeyPressed(playerKeys[2]) && this.timeSinceLastNav > this.navigationCooldown) {
            this.selectedCategoryIndex = Math.max(0, this.selectedCategoryIndex - 1);
            this.timeSinceLastNav = 0;
        }
        if (inputHandler.isKeyPressed(playerKeys[3]) && this.timeSinceLastNav > this.navigationCooldown) {
            this.selectedCategoryIndex = Math.min(this.categories.length - 1, this.selectedCategoryIndex + 1);
            this.timeSinceLastNav = 0;
        }

        if (this.categories[this.selectedCategoryIndex] === "Skin") {
            if (inputHandler.isKeyPressed(playerKeys[0])) { // gauche
                this.changeSkin(-1);
            }
            if (inputHandler.isKeyPressed(playerKeys[1])) { // droite
                this.changeSkin(1);
            }
        } else if (this.categories[this.selectedCategoryIndex] === "Touches") {
            if (inputHandler.isKeyPressed(playerKeys[0])) {
                this.changeKeys(-1);
            }
            if (inputHandler.isKeyPressed(playerKeys[1])) {
                this.changeKeys(1);
            }
        } else if (this.categories[this.selectedCategoryIndex] === "Prêt") {
            if (inputHandler.isKeyPressed('Enter')) {
                this.playerConfig.ready = true;
                this.isReady = true;
            }
        }

        // Mise à jour de l’animation du skin
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
            this.timeSinceLastFrame = 0;
        }
    }

    changeSkin(direction: number) {
        const currentIndex = this.availableSkins.indexOf(this.playerConfig.skin);
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = this.availableSkins.length - 1;
        if (newIndex >= this.availableSkins.length) newIndex = 0;
        this.playerConfig.skin = this.availableSkins[newIndex];

        // Recharger l’image du skin et réinitialiser l’animation
        this.skinImageLoaded = false;
        this.loadSkinImage(this.playerConfig.skin);
        this.frameIndex = 0;
        this.timeSinceLastFrame = 0;
    }

    changeKeys(direction: number) {
        const currentIndex = this.availableKeySets.findIndex(ks =>
            ks.join(',') === this.playerConfig.keys.join(','));
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = this.availableKeySets.length - 1;
        if (newIndex >= this.availableKeySets.length) newIndex = 0;
        this.playerConfig.keys = this.availableKeySets[newIndex];
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'white';
        context.font = '25px Arial';
        context.fillText(`Configuration du Joueur ${this.playerNumber}`, 50, 50);

        // Affichez les catégories
        this.drawCategory(context, "Skin", 0, 100);
        this.drawCategory(context, "Touches", 0, 300);
        this.drawCategory(context, "Prêt", 0, 450);

        this.drawSkinPreview(context, 50, 150);

        context.fillStyle = 'yellow';
        context.fillText(` ${this.playerConfig.keys.join(',')}`, 0, 350);

        // Indication si prêt
        if (this.playerConfig.ready) {
            context.fillStyle = 'green';
            context.fillText("Joueur Prêt !", 0, 350);
        }
    }

    drawCategory(context: CanvasRenderingContext2D, text: string, x: number, y: number) {
        if (this.categories[this.selectedCategoryIndex] === text) {
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.strokeRect(x, y-20, 200, 30);
        }

        context.fillStyle = 'white';
        context.fillText(text, x+10, y);
    }

    drawSkinPreview(context: CanvasRenderingContext2D, x: number, y: number) {
        if (!this.skinImageLoaded) {
            // L’image n’est pas encore chargée, afficher un texte ou rien
            context.fillStyle = 'gray';
            context.fillText('Chargement...', x, y);
            return;
        }

        // On suppose que la première ligne du sprite contient les frames d’animation
        // frameIndex détermine la frame à dessiner
        // On dessine la frame frameIndex à partir du sprite sheet

        const sx = this.frameIndex * this.frameWidth; // Position x de la frame dans le sprite sheet
        const sy = 7*64; // Première ligne, donc y = 0
        context.drawImage(
            this.skinImage,
            sx, sy, this.frameWidth, this.frameHeight,
            x, y, this.frameWidth, this.frameHeight
        );
    }
}
