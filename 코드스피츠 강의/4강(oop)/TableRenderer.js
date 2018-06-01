import Renderer from './Renderer';

const el = el => document.createElement(el);
const backColor = (style, color) => style.backgroundColor = color;

const TableRenderer = class extends Renderer {
    constructor(col, row, back, style) {
        super(col, row, el('table'), back);
        const { base, blocks } = this;
        base.style.cssText = style;
        let i = row;
        while (i--) {
            const tr = base.appendChild(el('tr'));
            const curr = [];
            let j = col; // 값 복사
            blocks.push(curr);
            while (j--) {
                curr.push(tr.appendChild(el('td')).style);
            }
        }
    }

    clear() {
        this.blocks.forEach(curr => curr.forEach(style => backColor(style, this.back)));
    }

    _render(data) {
        this.blocks.forEach((curr, i) => curr.forEach((style, j) => backColor(style, data[i][j])));
    }
};

export default TableRenderer;