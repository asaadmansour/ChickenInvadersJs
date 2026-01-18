class Config {
    canvasWidth = 0;
    canvasHeight = 0;
    
    updateDimensions(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }
    
    getChickenWidth() { return this.canvasWidth * 0.035; }
    getChickenHeight() { return this.canvasWidth * 0.035; }
    getPlayerWidth() { return this.canvasWidth * 0.04; }
    getPlayerHeight() { return this.canvasWidth * 0.04; }
    getEggWidth() { return this.canvasWidth * 0.01; }      
    getEggHeight() { return this.canvasWidth * 0.015; }
    getBulletWidth() { return this.canvasWidth * 0.005; } 
    getBulletHeight() { return this.canvasWidth * 0.02; }
}

export const GameConfig = new Config();