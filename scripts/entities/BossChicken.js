import { BOSS_CHICKEN, ENTITY_RATIOS } from "../config/Constants.js";
import { Chicken } from "./Chicken.js";
import { CanvasManager } from "../core/CanvasManager.js";

export class BossChicken extends Chicken {
    constructor(x,y,speed = BOSS_CHICKEN.MOVE_SPEED,lives = BOSS_CHICKEN.LIVES) {
        super(x,y,speed,lives);
        this.score = BOSS_CHICKEN.SCORE;
        this.maxLives = lives;
        this.dropRate = BOSS_CHICKEN.DROP_RATE;
    }
  get width() {
    return (
      CanvasManager.getInstance().width * ENTITY_RATIOS.BOSS_CHICKEN_WIDTH
    );
  }
  get healthPercentage() {
    return this.lives / this.maxLives;
  }
  get height() {
    return (
      CanvasManager.getInstance().height * ENTITY_RATIOS.BOSS_CHICKEN_HEIGHT
    );
  }
  get phase() {
    if(this.healthPercentage > 0.6) return 1;
    if(this.healthPercentage > 0.3) return 2;
    return 3;
  }
  move(time) {
    switch (this.phase) {
        case 1: this.movePhase1(time); break;
        case 2: this.movePhase2(time); break;
        case 3: this.movePhase3(time); break;
    }
    this.clampToBounds();
    }
    onHit() {
        this.isHurt = true;
        setTimeout(() => this.isHurt = false, 200);  
    }
    movePhase1(time) {
        // Slow, wide movement
        this.x = this.startX + Math.sin(time * 0.25) * this.horizontalRange * 3;
        this.y = this.startY + Math.sin(time * 0.5) * this.verticalRange * 2;
    }
    // Moderate speed, wider sweep
    movePhase2(time) {
        this.x = this.startX + Math.sin(time * 0.5) * this.horizontalRange * 4;
        this.y = this.startY + Math.sin(time) * this.verticalRange * 2.5;
    }
    // Faster but still controlled
    movePhase3(time) {
        this.x = this.startX + Math.sin(time * 0.7) * this.horizontalRange * 5;
        this.y = this.startY + Math.sin(time * 1) * this.verticalRange * 3;
    }
    drop() {
    const baseX = this.x + this.width / 2;
    const baseY = this.y + this.height;
    
    switch (this.phase) {
        case 1: 
            return [{ x: baseX, y: baseY }];  
        case 2: 
            return [                           
                { x: baseX - 40, y: baseY },
                { x: baseX, y: baseY },
                { x: baseX + 40, y: baseY },
            ];
        case 3: 
        default:  
            return [                          
                { x: baseX - 60, y: baseY },
                { x: baseX - 35, y: baseY },
                { x: baseX, y: baseY },
                { x: baseX + 35, y: baseY },
                { x: baseX + 60, y: baseY },
            ];
        }
    }   
}
