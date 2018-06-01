const Data = class extends Array {
    constructor(col, row) {
        super();

        this.col = col;
        this.row = row;
    }

    // this[...]인 이유는 Array를 상속했기 때문이다.
    cell(row, col, color) {
        if (row > this.row || col > this.col)
            throw 'invalid!';
        (this[row] || (this[row] = []))[col] = color;
    }

    // cell을 재활용하는 이유는
    // cell이 검사 역할을 하기 때문이다.
    row(row, ...color) {
        color.forEach((color, i) => this.cell(row, i, color));
    }

    all(...rows) {
        rows.forEach((row, i) => this.row(i, ...row));
    }
};

export default Data;