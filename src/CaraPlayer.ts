import {Sprite} from "./Sprite.ts";
import {InputHandler} from "./InputHandler.ts";
import {Level} from "./Level.ts";

export class CaraPlayer {
  private position: { x: number; y: number };
  public key : string[];
  public direction: string;
  sprite: Sprite;
  speed: number = 3;
  public score: number = 0;
  size = 40;
  respawnPosition: { x: number; y: number };
  isRespawn : boolean;
  respawnTime=0;
  lives : number;
  private isVisible: boolean;
  private timeSinceLastBlink: number;
  private blinkInterval: number;

  constructor(sprite: Sprite, key: string[]) {
    this.position = { x:0, y:0 };
    this.direction = 'down';
    this.sprite = sprite;
    this.key = key;
    this.respawnPosition = { x:0, y:0 };
    this.isRespawn=false;
    this.lives = 3;
    this.blinkInterval = 100; // temps entre deux "switch" de visibilité
    this.timeSinceLastBlink = 0;
    this.isVisible = true;

  }

  update(inputHandler: InputHandler, deltaTime: number, level: Level) {
    let dx = 0;
    let dy = 0;
    if (inputHandler.isKeyPressed(this.key[0])) dx -= this.speed; //gauche
    if (inputHandler.isKeyPressed(this.key[1])) dx += this.speed; //droite
    if (inputHandler.isKeyPressed(this.key[2])) dy -= this.speed; //haut
    if (inputHandler.isKeyPressed(this.key[3])) dy += this.speed; //bas
    const newX = this.position.x + dx;
    const newY = this.position.y + dy;

    const xok:boolean = level.isPositionPassable(newX, this.position.y-dy,this.size);
    const yok:boolean = level.isPositionPassable(this.position.x-dx, newY,this.size);

    if (xok) {
      this.position.x += dx;
    }
    else {
      this.position.x -= dx;
    }
    if (yok) {
      this.position.y += dy;
    }
    else {

      this.position.y -= dy;
    }


    if (this.position.x + dx < 0) dx = 0;
    else if (this.position.x + dx > 1400 - this.size) dx = 1400-this.size;
    else this.position.x += dx;
    if (this.position.y + dy < 0) dy = 0;
    else if (this.position.y + dy > 800 - this.size) dy = 800-this.size;
    else this.position.y += dy;

    this.setDirection(dx, dy);
    if(this.isRespawn) {
      this.respawnTime -= deltaTime;
      this.timeSinceLastBlink += deltaTime;

      // Alterner la visibilité toutes les blinkInterval ms
      if (this.timeSinceLastBlink > this.blinkInterval) {
        this.isVisible = !this.isVisible;
        this.timeSinceLastBlink = 0;
      }
      if(this.respawnTime <=0) {
        this.isRespawn = false;
        this.isVisible = true;
      }
    }
    this.sprite.update(deltaTime, this.direction);
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.isVisible)
      this.sprite.render(context, this.position.x-12, this.position.y-25);
  }

  drawPanel(context: CanvasRenderingContext2D,panelX:number,panelY:number) {
    this.sprite.render(context, panelX, panelY);
    context.fillText(`Vie ${this.lives }:`,panelX, panelY+90);
  }

  public setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }

  public getPosition() {
    return { x: this.position.x+8, y: this.position.y+10 };
  }

  static createCaraPlayer(sprite: Sprite, key: string[]) {
      return new CaraPlayer(sprite, key);
  }

  setDirection(dx: number, dy: number) {
    if (dx === 0 && dy < 0) this.direction = 'up';
    else if (dx > 0 && dy < 0) this.direction = 'up-right';
    else if (dx > 0 && dy === 0) this.direction = 'right';
    else if (dx > 0 && dy > 0) this.direction = 'down-right';
    else if (dx === 0 && dy > 0) this.direction = 'down';
    else if (dx < 0 && dy > 0) this.direction = 'down-left';
    else if (dx < 0 && dy === 0) this.direction = 'left';
    else if (dx < 0 && dy < 0) this.direction = 'up-left';
  }

  takeDamage(amount: number) {
    if(!this.isRespawn) {
      this.lives -= amount;
      if (this.lives <= 0) {
        this.respawn();
      } else {
        this.isRespawn = true;
        this.respawnTime = 500;
      }
    }
  }

  getIsRespawn():boolean{
    return this.isRespawn;
  }

  respawn() {
    this.position.x = this.respawnPosition.x;
    this.position.y = this.respawnPosition.y;
    this.isRespawn=true;
    this.respawnTime=1000;
    this.lives=3;
  }


}