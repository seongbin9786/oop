// 과제 #1 - 전략 함수에서 전략 클래스로 변경한다.
// Github이 Loader와 계약을 맺는다.
// 공통코드 - 부모클래스 Loader
// 자식코드 - Loader를 상속한다.
class Github {
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }
    
    load(path) {
        const id = `callback${Github._id++}`;
        Github[id] = ({ data: { content } }) => {
            this._content = content;

            delete Github[id];
            document.head.removeChild(s);
            // 수정된 부분 1 = 함수 호출에서 메소드 호출로.
            this._parser.load(content);
        };
        const s = document.createElement('script');
        s.src = `${this._base}/${path}?callback=Github.${id}`;
        console.log(s.src);
        document.head.appendChild(s);
    }
    
    set parser(parser) {
        // 추가된 부분 1 - 타입 체크
        if (!(parser instanceof Loader))
            throw '해석기는 Loader 타입이어야 합니다.';

        this._parser = parser;
    }
}

// 추가된 부분 2 - Loader 클래스
class Loader {
    constructor(parentSelector) {
        this._parentSelector = parentSelector;
    }

    /* eslint-disable */
    load(content) {
        throw '메소드가 오버라이딩되지 않았습니다.';
    }
}

// 추가된 부분 3 - ImageLoader 클래스
class ImageLoader extends Loader {
    constructor(parentSelector) {
        super(parentSelector);
    }

    load(content) {
        document.querySelector(this._parentSelector).src = `data:/text/plain;base64,${content}`;
    }
}

Github._id = 0;

const loader = new Github('hikaMaeng', 'codespitz75');
const img = new ImageLoader('#a');
loader.parser = img;
loader.load('einBig.png');