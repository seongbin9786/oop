const Score = class {
    init(listener) {
        this.listener = listener;
    }

    clear() {
        this.curr = this.total = 0;
    }

    add(line, stage) {
        // **는 ES7의 표준으로, Mat.pow(a, b)와 같다고 한다.
        // stage 1에서 1라인을 부순 경우 = 1 * 5 * 2 ** 1 = 10
        // stage 20에서 5라인을 부순 경우 = (20 * 5) * (2^5) = 3200
        // ㅇㅅㅇ...
        const score = parseInt((stage * 5) * (2 ** line));
        this.curr += score, this.total += score;
        this.listener();
    }

    [Symbol.toPrimitive]() {
        return `<div>Score ${this.curr} / ${this.total}</div>`;
    }
};

export default Score;