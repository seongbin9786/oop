const Block = class {
    constructor(color, ...blocks) {
        this.color = color;
        this.blocks = blocks;
        this.rotate = 0;
    }

    left() {
        if (--this.rotate < 0)
            this.rotate = 3;
    }

    right() {
        if (++this.rotate > 3)
            this.rotate = 0;
    }

    getBlock() {
        return this.blocks[this.rotate];
    }
};

export default Block;