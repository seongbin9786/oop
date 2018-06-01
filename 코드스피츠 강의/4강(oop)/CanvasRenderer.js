import Renderer from './Renderer';

const el = el => document.createElement(el);

const CanvasRenderer = class extends Renderer {
    constructor(col, row, back, style) {
        // back은 아예 안쓰나봐
        super(col, row, el('canvas'));
        const { base } = this;
        base.style.cssText = style;
        Object.assign(this, {
            width: base.width = parseInt(base.style.width),
            height: base.height = parseInt(base.style.height),
            // 순차적으로 해석하는 것으로 바뀜.
            // ES6부터 적용, ES5까지는 안 됨
            cellSize: [base.width/col, base.height/row],
            ctx: base.getContext('2d'),
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    _render(data) {
        this.clear();
        const { col, ctx, cellSize: [width, height] } = this;
        let { row: i } = this;
        while(i--) {
            let j = col;
            while(j--) {
                ctx.fillStyle = data[i][j];
                ctx.fillRect(j * width, i * height, width, height);
            }
        }
    }
};

export default CanvasRenderer;