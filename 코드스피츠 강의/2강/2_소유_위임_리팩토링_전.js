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
            this._parser(content);
        };
        const s = document.createElement('script');
        s.src = `${this._base}${path}?callback=Github.${id}`;
        document.head.appendChild(s);
    }
    
    // 위임 객체
    set parser(func) {
        this._parser = func;
    }
};

Github.id = 0;

// 전략 객체(함수)
// Type 체크의 이점을 살리지 못함
// 위임에 함수를 사용하면 편리하지만, 위험 부담이 있음
// 중요한 코드일수록 클래스를 사용
// imgLocator까지 재사용은 힘들듯. 위에서 정의되어버렸기 때문.
// *함수형 프로그래밍=> curring을 사용하여 selector를 재사용*
const imgParser = selector => content => {
    const target = document.querySelector(selector);
    target.src = `data:/text/plain;base64,${content}`;
};

const imgLoader = new Github('seongbin9786', 'oop');
imgLoader.parser = imgParser('#a');
imgLoader.load('logo.png');

// 이 방식의 단점은 md를 로딩하기 전에, mdParser가 필요하다는 것이다.
// case를 분기하는 로직이 parser를 세팅하는 로직이 되어버렸다.
// 즉, 아직 case 로직을 제거하지 못했다. (아직도 연산 중인 것임)
// 연산 ---> 용량으로 대치하기 위해, Map을 사용하여 리팩토링 해야 한다.
const mdParser = selector => content => {
    const target = document.querySelector(selector);
    target.innerHTML = content;
};

const mdLoader = new Github('seongbin', 'oop');
mdLoader.parser = mdParser;
mdParser.load('README.md');