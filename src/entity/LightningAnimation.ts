export class LightningAnimation {
    private x: number;
    private y: number;
    private image: HTMLImageElement;
    private frameCount: number;
    private frameWidth: number;
    private frameHeight: number;
    private frameIndex: number;
    private frameInterval: number; // en ms
    private timeSinceLastFrame: number;
    finished: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'src/assets/entity/trap.png';
        this.frameCount = 12;
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.frameIndex = 0;
        this.frameInterval = 50; // changez en fonction de la vitesse souhaitée
        this.timeSinceLastFrame = 0;
        this.finished = false;
    }

    public update(deltaTime: number) {
        if (this.finished) return;

        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frameIndex++;
            this.timeSinceLastFrame = 0;
            if (this.frameIndex >= this.frameCount) {
                this.finished = true;
            }
        }
    }

    public draw(context: CanvasRenderingContext2D) {
        if (this.finished) return;

        if (this.image.complete) {
            const sx = this.frameIndex * this.frameWidth;
            const sy = 0;
            context.drawImage(
                this.image,
                sx, sy, this.frameWidth, this.frameHeight,
                this.x, this.y, this.frameWidth, this.frameHeight
            );
        }
    }
}
