import Data from './Data';

const Renderer = class {
    constructor(col, row, base, back) {
        this.col = col,
        this.row = row,
        this.base = base,
        this.back = back,
        this.blocks = [];
    }

    clear() {
        throw 'override';
    }

    // Data도 결국 Array일 뿐임
    // Data를 타입으로 활용
    render(data) {
        if(!(data instanceof Data))
            throw 'data';
        this._render(data);
    }
    
    _render(data) {
        throw 'override! received:' + data;
    }
};

export default Renderer;