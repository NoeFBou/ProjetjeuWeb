export class Sprite {
    private _image: HTMLImageElement;
    private _framesPerDirection: number;
    private _currentFrame: number;
    private _timeSinceLastFrame: number;
    private _frameInterval: number;
    directions: string[];
    currentDirectionIndex: number;

    constructor(imageSrc: string, framesPerDirection: number, frameInterval: number, directions: string[]) {
        this._image = new Image();
        this._image.src = imageSrc;
        this._framesPerDirection = framesPerDirection;
        this._currentFrame = 0;
        this._timeSinceLastFrame = 0;
        this._frameInterval = frameInterval;
        this.directions = directions;
        this.currentDirectionIndex = 0;
        this._image.onload = () => {
        }
    }

    public update(deltaTime: number, direction: string) {
        this._timeSinceLastFrame += deltaTime;

        if (this._timeSinceLastFrame > this._frameInterval) {
            this._currentFrame = (this._currentFrame + 1) % this._framesPerDirection;
            this._timeSinceLastFrame = 0;
        }

        this.currentDirectionIndex = this.directions.indexOf(direction);
    }

    public render(context: CanvasRenderingContext2D, x: number, y: number) {
        const frameWidth = this._image.width / this._framesPerDirection;
        const frameHeight = this._image.height / this.directions.length;

        context.drawImage(
            this._image,
            this._currentFrame * frameWidth,
            this.currentDirectionIndex * frameHeight,
            frameWidth,
            frameHeight,
            x,
            y,
            frameWidth,
            frameHeight
        );
    }

    public load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._image.onload = () => resolve();
            this._image.onerror = () => reject(new Error(`Impossible de charger l'image : ${this._image.src}`));
        });
    }




}