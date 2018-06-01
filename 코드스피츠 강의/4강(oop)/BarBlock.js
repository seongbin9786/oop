import Block from './Block';

const BarBlock = class extends Block {
    constructor() {
        super(
            '#F8CBAD',
            [[1], [1], [1], [1]],
            [[1, 1, 1, 1]],
            [[1], [1], [1], [1]],
            [[1, 1, 1, 1]]
        );
    }
};

export default BarBlock;