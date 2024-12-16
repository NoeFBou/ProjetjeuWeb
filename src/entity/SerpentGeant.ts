import {CaraPlayer} from "../CaraPlayer.ts";

export class SerpentGeant {
    segments: {x: number, y: number, width: number, height: number}[];
    speedX: number;
    speedY: number;
    segmentGap: number;
    positions: {x: number, y: number}[];

    constructor(startX: number, startY: number) {
        const segmentWidth = 80;
        const segmentHeight = 80;
        this.segmentGap = 100; // Espace en pixels entre segments
        this.segments = [];
        for (let i = 0; i < 4; i++) {
            this.segments.push({
                x: startX - i * this.segmentGap,
                y: startY,
                width: segmentWidth,
                height: segmentHeight
            });
        }

        this.speedX = 2;
        this.speedY = 2;
        this.positions = [];
        // On initialise positions avec la position de départ de la tête
        this.positions.push({ x: startX, y: startY });
    }

    update(deltaTime: number, canvasWidth: number, canvasHeight: number) {
        const head = this.segments[0];

        // Déplacement de la tête
        head.x += this.speedX;
        head.y += this.speedY;

        // Rebond sur les bords
        if (head.x < 0) {
            head.x = 0;
            this.speedX = -this.speedX;
        } else if (head.x + head.width > canvasWidth) {
            head.x = canvasWidth - head.width;
            this.speedX = -this.speedX;
        }
        if (head.y < 0) {
            head.y = 0;
            this.speedY = -this.speedY;
        } else if (head.y + head.height > canvasHeight) {
            head.y = canvasHeight - head.height;
            this.speedY = -this.speedY;
        }

        this.positions.push({ x: head.x, y: head.y });

        if (this.positions.length > 2000) {
            this.positions.shift(); // supprime l'élément le plus ancien
        }

        const speed = Math.hypot(this.speedX, this.speedY);

        for (let i = 1; i < this.segments.length; i++) {
            const framesDelay = Math.round((this.segmentGap * i) / speed);
            const index = this.positions.length - 1 - framesDelay;
            if (index >= 0) {
                this.segments[i].x = this.positions[index].x;
                this.segments[i].y = this.positions[index].y;
            }
        }
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'purple';
        for (const seg of this.segments) {
            context.fillRect(seg.x, seg.y, seg.width, seg.height);
        }
    }

    collidesWith(character: CaraPlayer): boolean {
        for (const seg of this.segments) {
            const charX = character.getPosition().x;
            const charY = character.getPosition().y;
            if (charX < seg.x + seg.width &&
                charX + character.size > seg.x &&
                charY < seg.y + seg.height &&
                charY + character.size > seg.y) {
                return true;
            }
        }
        return false;
    }
}
