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
            this._parser(content);
        };
        const s = document.createElement('script');
        s.src = `${this._base}/${path}?callback=Github.${id}`;
        console.log(s.src);
        document.head.appendChild(s);
    }
    
    set parser(func) {
        this._parser = func;
    }
}

Github._id = 0;

class Loader {
    constructor(github) {
        this._github = github;
        this._router = new Map();
    }

    addParser(dataTypes, parser) {
        dataTypes.split(',').forEach(type => {
            this._router.set(type, parser);
        });
    }

    load(data) {
        // Array의 pop 메소드는 마지막 요소를 반환한다.
        const dataType = data.split('.').pop();
        if (!this._router.has(dataType))
            throw `${dataType}는 지원하지 않는 형식입니다.`;

        this._github.parser = this._router.get(dataType);
        this._github.load(data);
    }
}

const imgParser = selector => content => {
    document
        .querySelector(selector)
        .src = `data:/text/plain;base64,${content}`;
};

const mdParser = selector => content => {
    document
        .querySelector(selector)
        .innerHTML = content;
};

// 라우팅하기 전에, 파서를 등록한다. (케이스 등록)
const loader = new Loader(new Github('jojoldu', 'junior-recruit-scheduler'));
loader.addParser('png,jpg', imgParser('#a'));
loader.addParser('md', mdParser('#b'));

// 케이스를 로드 메소드에서 알아서 판별해 파서를 실행한다. (라우팅)
loader.load('images/버튼설명.png');
// loader.load('README.md');
