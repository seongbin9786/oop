// Marker 인터페이스인가?
const Controller = class {
};

const Singleton = class extends WeakMap {
    has() { err(); }
    get() { err(); }
    set() { err(); }
    getInstance(v) {
        if (!super.has(v.constructor)) super.set(v.constructor, v);
        return super.get(v.constructor);
    }
};

const singleton = new Singleton();

const App = class {
    constructor(_parent = err()) {
        prop(this, { _parent, _table: new Map() });
    }

    add(k = err(), controller = err()) {
        k = k.split(':');
        this._table.set(k[0], controller);
        (k[1] || '').split(',').concat('base').forEach(v => this._table.set(`${k[0]}:${v}`, controller));
    }

    // 페이지를 path에 맞게 렌더링한다.
    route(path = err(), ...args) {
        // path = key:action 형태
        // action 생략 시 base
        const [k, action = 'base'] = path.split(':');
        console.log('@@@APP@@@ Routing To @@@', k, ':', action, '호출 @@@');

        // 적절한 key 가 없는 경우 렌더링하지 않음
        if (!this._table.has(k)) return;

        // 컨트롤러를 key로 가져옴
        // () => new Home(true)를 반환하므로 한번 더 실행
        const controller = this._table.get(k)();

        // Home에는 action과 동일한 이름의 메소드가 있다.
        // 그 메소드를 매개변수로 호출해준다.
        // 그 메소드는 View의 렌더링 결과를 반환한다.
        const viewData = controller[action](...args);
        console.log('viewData:', viewData);

        const parent = attr(sel(this._parent), 'innerHTML', '');
        console.log('parent:', parent);

        // 부모 아래에 렌더링합시다.
        append(parent, viewData);
    }
};

const Model = class extends Set {
    constructor(isSingleton) {
        super();
        if(isSingleton) return singleton.getInstance(this);
    }

    add() { err(); }
    delete() { err(); }
    has() { err(); }

    addController(v) {
        console.log('[addController] Controller:', v);
        if (!is(v, Controller)) err();
        super.add(v);
    }

    removeController(v) {
        if (!is(v, Controller)) err();
        super.delete(v);
    }

    notify() {
        this.forEach(v => v.listen(this));
    }
};

const HomeModel = class extends Model {
    constructor(isSingleton) {
        super(isSingleton);

        const initData = [];
        for (idGenerator = 1; idGenerator <= 10; idGenerator++) {
            initData.push(new HomeDetailModel(idGenerator, `todo${idGenerator}`, `memo${idGenerator}`));
        }

        if (!this._list) prop(this, { _list: [ ...initData ]});
    }

    add(...v) { 
        this._list.push(...v);
        this.notify(); 
    }

    remove(id) {
        console.log(`[HomeModel]: remove(${id})`);
        const { _list: list } = this;
        if (!list.some((v, i) => {
            if (v.id == id) {
                list.splice(i, 1);
                return true;
            }
        })) err();

        this.notify();
    }

    get list() { return [...this._list]; }

    get(id) {
        let result;
        if (!this._list.some(v => v.id == id ? (result = v) : false)) err();
        return result;
    }
};

const HomeDetailModel = class extends Model {
    constructor(_id = err(), _title = err(), _memo = '') {
        super();
        prop(this, { _title, _id, _memo });
    }

    edit(_title = '', _memo = '') {
        prop(this, { _title, _memo });
        this.notify();
    }

    get title() { return this._title; }
    get id() { return this._id; }
    get memo() { return this._memo; }
};

const View = class {
    constructor(_controller = err(), isSingleton = false) {
        prop(this, { _controller });
        if (isSingleton) return singleton.getInstance(this);
    }
    render(model = null) { override(model); }
};

// 최초 페이지인 Home의
// 기본 action인 Base의
// 페이지를 반환하는 View이다.
const HomeBaseView = class extends View {
    constructor(controller, isSingleton) {
        super(controller, isSingleton);
    }

    // 그린 페이지를 반환한다.
    render(model = err()) {
        if (!is(model, HomeModel)) err();
        const { _controller: ctrl } = this;

        const result = append(
            el('ul'), 
            // Add Feature
            el('section',
                '@marginLeft', '15px',
                'appendChild', el('input', 'type', 'text'),
                'appendChild', el('button', 'innerHTML', 'Add Todo',
                    'addEventListener', ['click', e => ctrl.$add(e)])
            ),
            // Add Feature

            ...model.list.map(v => append(
                el('li'),
                el('a', 'innerHTML', v.title, 'addEventListener', ['click', () => ctrl.$detail(v.id)]),
                el('button', 'innerHTML', 'x', 'addEventListener', ['click', () => ctrl.$remove(v.id)]),
            ))
        );

        console.log('HomeBaseView returned:', result);
        return result;
    }
};

const HomeDetailView = class extends View {
    constructor(controller, isSingleton) {
        super(controller, isSingleton);
    }

    render(model = err()) {
        if (!is(model, HomeDetailModel)) err();
        const { _controller: ctrl } = this;
        const sec = el('section');

        const result = append(sec,
            el('input', 'value', model.title, '@cssText', 'display: block', 'className', 'title'),
            el('textarea', 'innerHTML', model.memo, '@cssText', 'display: block', 'className', 'memo'),
            el('button', 'innerHTML', '', model.memo, '@cssText', 'display: block', 'className', 'memo'),
            el('button', 'innerHTML', 'edit', 'addEventListener', ['click', () => ctrl.$editDetail(model.id, sel('.title', sec).value, sel('.memo', sec).value)]),
            el('button', 'innerHTML', 'delete', 'addEventListener', ['click', () => ctrl.$removeDetail(model.id)]),
            el('button', 'innerHTML', 'list','addEventListener', ['click', () => ctrl.$list()])
        );
        console.log('HomeDetailView returned:', result);
        return result;
    }
};

const HomeController = class extends Controller {
    constructor(isSingleton) {
        super(isSingleton);
    }

    // action 기본값인 base이다.
    // View가 렌더링한 페이지를 반환한다.
    base() {
        const view = new HomeBaseView(this, true);
        const model = new HomeModel(true);

        // ㅋㅋ 이것때문에 몇 시간을 날린거임?
        // addController를 계속하기 때문에 계속 notify 된다.
        // model.addController(this);
        return view.render(model);
    }
    
    detail(id) {
        // 생성자에서 addController를 하다니. 와.
        const view = new HomeDetailView(this, true);
        const model = new HomeModel(true).get(id);

        // addController를 계속하기 때문에 계속 notify 된다.
        // model.addController(this);
        return view.render(model);
    }

    $list() { 
        app.route('home'); 
    }

    $detail(id) { 
        console.log('$detail ->', id);
        app.route('home:detail', id); 
    }

    $editDetail(id, title, memo) {
        const model = new HomeModel(true).get(id);
        model.addController(this);
        model.edit(title,  memo);
    }

    $add(e) {
        const model = new HomeModel(true);
        const { value } = e.target.previousElementSibling;
        model.add(new HomeDetailModel(idGenerator++, value, ''));
        this.$list();
    }

    $remove(id) { 
        const model = new HomeModel(true);
        model.remove(id);
        this.$list();
    }

    $removeDetail(id) {
        this.$remove(id);
    }

    listen(model) {
        switch(true) {
        case is(model, HomeModel): 
            console.log('its the case!');
            return this.$list();
        case is(model, HomeDetailModel): 
            return this.$detail(model.id);
        }
    }
};

// utility functions
const prop = (t, p) => Object.assign(t, p);
const is = (target, clazz) => target instanceof clazz;
const override = () => { throw 'override please!'; };
const err = () => { throw 'error!'; };
const el = (tag, ...attr) => {
    const el = typeof tag == 'string' ? document.createElement(tag) : tag;
    for (let i = 0; i < attr.length; ) {
        const k = attr[i++];
        const v = attr[i++];
        if (typeof el[k] == "function") 
            el[k](...(Array.isArray(v) ? v : [v]));
        else if (k[0] == "@") 
            el.style[k.substr(1)] = v;
        else 
            el[k] = v;
    }
    console.log('el:', el);
    return el;
};

const attr = (el, key, value) => {
    if (!el) err();

    el[key] = value;
    return el;
};

const sel = (v, el = document) => {
    const result = el.querySelector(v);
    console.log('sel:', result);
    if (!result) { 
        console.log('[Exception] selector: ', v, el);
        err();
    }
    return el.querySelector(v);
};

const append = (parent, ...children) => {
    if (!parent) {
        console.log('[append] parent 불량');
        err();
    }
    children.reduce((prev, curr) => {
        prev.appendChild(curr);
        return prev;
    }, parent);
    return parent;
};

// application codes
let idGenerator = 1;
const app = new App('#stage');
app.add('home:detail', () => new HomeController(true));
app.route('home');