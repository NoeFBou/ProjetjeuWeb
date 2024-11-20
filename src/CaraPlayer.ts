import {Sprite} from "./Sprite.ts";
import {InputHandler} from "./InputHandler.ts";

export class CaraPlayer {
  public position: { x: number; y: number };
  public key : string[];
  public direction: string;
  sprite: Sprite;
  speed: number = 7;
  public score: number = 0;
  size = 64;
  respawnPosition: { x: number; y: number };
  isRespawn : boolean;
  respawnTime=0;

  constructor(sprite: Sprite, key: string[]) {
    this.position = { x:0, y:0 };
    this.direction = 'down';
    this.sprite = sprite;
    this.key = key;
    this.respawnPosition = { x:0, y:0 };
    this.isRespawn=false;
  }


  update(inputHandler: InputHandler, deltaTime: number) {
    let dx = 0;
    let dy = 0;

    if (inputHandler.isKeyPressed(this.key[0])) dx -= this.speed; //gauche
    if (inputHandler.isKeyPressed(this.key[1])) dx += this.speed; //droite
    if (inputHandler.isKeyPressed(this.key[2])) dy -= this.speed; //haut
    if (inputHandler.isKeyPressed(this.key[3])) dy += this.speed; //bas
    if (this.position.x + dx < 0) dx = 0;
    else if (this.position.x + dx > 1400 - this.size) dx = 1400-this.size;
    else this.position.x += dx;
    if (this.position.y + dy < 0) dy = 0;
    else if (this.position.y + dy > 800 - this.size) dy = 800-this.size;
    else this.position.y += dy;

    this.setDirection(dx, dy);
    if(this.isRespawn) {
      this.respawnTime -= deltaTime;
      if(this.respawnTime <=0)
        this.isRespawn=false;
    }


    this.sprite.update(deltaTime, this.direction);
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

  draw(context: CanvasRenderingContext2D) {
    this.sprite.render(context, this.position.x, this.position.y);
  }


  static createCaraPlayer(sprite: Sprite, key: string[]) {
      return new CaraPlayer(sprite, key);
  }
  getIsRespawn():boolean{
    return this.isRespawn;
  }

  respawn() {
    this.position.x = this.respawnPosition.x;
    this.position.y = this.respawnPosition.y;
    this.isRespawn=true;
    this.respawnTime=1000;
  }
}