// texture info
class TextureInfo extends Object2D {
    constructor() {
        super();
        this.texture;
    }
    setTexture(texture) {
        this.texture = texture;
    }
}
// draw info
class DrawInfo extends Object2D {
    constructor() {
        super();
        this.drawWidth = 0;
        this.drawHeight = 0;
        this.dy = 0;
        this.dx = 0;
        this.dy = 0;
        this.xScale;
        this.yScale;
        this.textureInfo;
    }
    setDrawWidth(drawWidth) {
        this.drawWidth = drawWidth;
    }
    setDrawHeight(drawHeight) {
        this.drawHeight = drawHeight;
    }
    setDx(dx) {
        this.dx = dx;
    }
    setDy(dy) {
        this.dy = dy;
    }
    setXScale(xScale) {
        this.xScale = xScale;
    }
    setYScale(yScale) {
        this.yScale = yScale;
    }
    setTextureInfo(textureInfo) {
        this.textureInfo = textureInfo;
    }
    contains(x, y) {
        return ((x - this.x) >= 0) && ((y - this.y) >= 0) && ((x - this.x) <= this.drawWidth) && ((y - this.y) <= this.drawHeight);
    }
}
// the section like a card
class Card extends DrawInfo {
    constructor() {
        super();
    }

}