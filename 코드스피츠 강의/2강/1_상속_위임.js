// 템플릿 메소드 패턴
const Github = class {
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }
    
    // 공통 부분
    load(path) {
        const id = `callback${Github._id++}`;
        Github[id] = ({ data: { content } }) => {
            this._content = content;

            delete Github[id];
            document.head.removeChild(s);
            // 위임 부분
            this._loaded();
        };
        const s = document.createElement('script');
        s.src = `${this._base}${path}?callback=Github.${id}`;
        document.head.appendChild(s);
    }

    // HOOK
    _loaded() {
        throw '오버라이딩이 필요합니다.';
    }
};

// 변하는 부분
// 실행 시점 선택
const ImageLoader = class extends Github {
    constructor(id, repo, target) {
        super(id, repo);
        this._target = target;
    }
    
    // HOOK
    _loaded() {
        this._target.src = `data:/text/plain;base64,${this._content}`;
    }
};

Github.id = 0;

const imgLoader = new ImageLoader(
    'seongbin9786', 
    'oop', 
    document.querySelector('#a')
);
imgLoader.load('logo.png');
