const Stage = class {
    // 1. listener를 왜 필요로 할까?
    // 2. 왜 생성자가 아닌 init이라는 메소드를 쓸까?
    // A: Game본체보다 Stage객체가 더 먼저 생성되기 때문이다.
    // A: 따라서 생성자 시점에서 Game 본체 객체를 listener로
    //    받을 수 없기 때문에 init 메소드로 설정한다.
    init(listener) {
        this.listener = listener;
    }

    clear() {
        this.stage = 0;
        this.next();
    }

    next() {
        if (this.stage++ < Stage.maxStage) {
            this.speed = 500 - 450 * this.stage / Stage.maxStage;
            this.listener();
        }
    }

    // 출력할 때 반환할 값을 의미한다.
    [Symbol.toPrimitive]() {
        return `<div>Stage ${this.stage}</div>`;
    }
};
Stage.maxStage = 20;

export default Stage;