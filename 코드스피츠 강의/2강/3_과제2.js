// 과제 #2 - 라우팅 테이블을 2단계로 확장한다.
// 저장소별 매핑이가능하도록 작성한다.
// n단 분리는 어떻게 할 수 있을까? 일반화?
// 일단 2단은 정적으로 할 수 있다.
// (ex) 스프링은 옵션이 굉장히 많다.
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

// Loader는 Github를 소유한다.
class Loader {
    constructor() {
        this._github = {};
        this._masterRouter = new Map();
    }

    // 깃허브 객체를 생성한다.
    // 마스터라우터에 라우터를 추가한다.
    addRepo(repoId, owner, repoName) {
        this.assertRepoNotExist(repoId);

        this._github[repoId] = new Github(owner, repoName);
        this._masterRouter.set(repoId, new Map());
    }

    addRouter(repoId, dataTypes, parser) {
        this.assertRepoExist(repoId);

        const router = this.getRouterById(repoId);
        dataTypes.split(',').forEach(type => {
            router.set(type, parser);
        });
    }

    // 라우터의 라우터 함수
    getRouterById(repoId) {
        return this._masterRouter.get(repoId);
    }

    getRepoById(repoId) {
        return this._github[repoId];
    }

    isRegistered(repoId) {
        return this._github[repoId] !== undefined;
    }

    load(repoId, data) {
        this.assertRepoExist(repoId);

        const router = this.getRouterById(repoId);
        const repo = this.getRepoById(repoId);

        const dataType = data.split('.').pop();
        if (!router.has(dataType))
            throw `${dataType}는 지원하지 않는 형식입니다.`;

        repo.parser = router.get(dataType);
        repo.load(data);
    }

    assertRepoExist(repoId) {
        if (!this.isRegistered(repoId))
            throw '등록되어 있지 않은 repo입니다.';
    }

    assertRepoNotExist(repoId) {
        if (this.isRegistered(repoId))
            throw '이미 등록된 repo입니다.';
    }
    
}

const imgParser = selector => content => {
    document
        .querySelector(selector)
        .src = `data:/text/plain;base64,${content}`;
};

const loader = new Loader();
loader.addRepo('s75', 'hikaMaeng', 'codespitz75');
loader.addRouter('s75', 'jpg,png,gif', imgParser('#a'));
loader.load('s75', 'einBig.png');

loader.addRepo('s74', 'hikaMaeng', 'codespitz75');
loader.addRouter('s74', 'jpg,png,gif', imgParser('#b'));
loader.load('s74', 'einBig.png');

