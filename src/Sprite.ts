export class Sprite {
    image: HTMLImageElement;
    framesPerDirection: number;
    currentFrame: number;
    timeSinceLastFrame: number;
    frameInterval: number;
    directions: string[];
    currentDirectionIndex: number;

    constructor(imageSrc: string, framesPerDirection: number, frameInterval: number, directions: string[]) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.framesPerDirection = framesPerDirection;
        this.currentFrame = 0;
        this.timeSinceLastFrame = 0;
        this.frameInterval = frameInterval;
        this.directions = directions;
        this.currentDirectionIndex = 0;
        this.image.onload = () => {
            console.log("test");
            console.log(this.image);
            console.log(this.image.height);

        }
    }

    update(deltaTime: number, direction: string) {
        this.timeSinceLastFrame += deltaTime;

        if (this.timeSinceLastFrame > this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.framesPerDirection;
            this.timeSinceLastFrame = 0;
        }

        this.currentDirectionIndex = this.directions.indexOf(direction);
    }

    render(context: CanvasRenderingContext2D, x: number, y: number) {
        const frameWidth = this.image.width / this.framesPerDirection;
        const frameHeight = this.image.height / this.directions.length;

        context.drawImage(
            this.image,
            this.currentFrame * frameWidth,
            this.currentDirectionIndex * frameHeight,
            frameWidth,
            frameHeight,
            x,
            y,
            frameWidth,
            frameHeight
        );
    }
}