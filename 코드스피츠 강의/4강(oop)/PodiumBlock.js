import Block from './Block';

const PodiumBlock = class extends Block {
    constructor() {
        super(
            '#FFE699',
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0], [1, 1], [1, 0]],
            [[1, 1, 1], [0, 1, 0]],
            [[0, 1], [1, 1], [0, 1]]
        );
    }
};

export default PodiumBlock;