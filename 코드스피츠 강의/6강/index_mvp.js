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

// CHANGE: controller => presenter
const App = class {
    constructor(_parent =err()) {
        prop(this, { _parent, _table: new Map });
    }
    
    add(k = err(), presenter = err()) {
        k = k.split(':');
        this._table.set(k[0], presenter).set(`${k[0]}:base`, presenter);
        if (k[1]) k[1].split(',').forEach(v => this._table.set(`${k[0]}:${v}`, presenter));
    }

    route(path = err(), ...args) {
        const [k, action = 'base'] = path.split(':');
        if (!this._table.has(k)) return;
        const presenter = this._table.get(k)();
        presenter[action](...args);
        append(attr(sel(this._parent), 'innerHTML', ''), presenter.view);
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

    addPresenter(v) {
        console.log('[addPresenter] Presenter:', v);
        if (!is(v, Presenter)) err();
        super.add(v);
    }

    removePresenter(v) {
        if (!is(v, Presenter)) err();
        super.delete(v);
    }

    notify() {
        console.log('notifying!', this);
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

    add(...v) { this._list.push(...v); }

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
    constructor(_id = err(), title = err(), memo = '') {
        super();
        prop(this, { _id });
        this.edit(title, memo);
    }

    edit(_title = '', _memo = '') {
        prop(this, { _title, _memo });
        console.log('editing!', _title, _memo, 'from:', this);
        this.notify();
    }

    get title() { return this._title; }
    get id() { return this._id; }
    get memo() { return this._memo; }
};

const View = class {
    constructor(_presenter = err(), _view = err(), isSingleton = false) {
        prop(this, { _presenter, _view });
        if (isSingleton) return singleton.getInstance(this);
    }

    get view() { return this._view; }
};

const HomeBaseView = class extends View {
    constructor(presenter, isSingleton) {
        // CHANGED: View의 constructor가 변경됨
        super(presenter, el('ul'), isSingleton);
    }
    
    set list(list) {
        const { _presenter: pres, view } = this;
        append(el(view, 'innerHTML', ''), ...list.map(v => append(
            el('li'),
            el('a', 'innerHTML', v.title, 'addEventListener', ['click', () => pres.$detail(v.id)]),
            el('button', 'innerHTML', 'X', 'addEventListener', ['click', () => pres.$remove(v.id)])
        )));
    }
};

const HomeDetailView = class extends View {
    constructor(presenter, isSingleton) {
        super(presenter, el('section'), isSingleton);
        append(el(this.view, 'innerHTML', ''),
            el('input', '@cssText', 'display: block', 'className', 'title'),
            el('textarea', '@cssText', 'display: block', 'className', 'memo'),
            el('button', 'innerHTML', 'edit', 'addEventListener', ['click', () => presenter.$editDetail()]),
            el('button', 'innerHTML', 'delete', 'addEventListener', ['click', () => presenter.$removeDetail()]),
            el('button', 'innerHTML', 'list','addEventListener', ['click', () => presenter.$list()])
        );
    }

    // ADDED getter/setter
    get title() { return sel('.title', this.view).value; }
    set title(title) { sel('.title', this.view).value = title; }
    get memo() { return sel('.memo', this.view).value; }
    set memo(memo) { sel('.memo', this.view).value = memo; }
};

const Presenter = class {
    constructor(isSingleton) {
        if (isSingleton) return singleton.getInstance(this);
    }

    //ADDED
    get view() { return this._view && this._view.view; }

    listen(model) { override(model); }
};

const Home = class extends Presenter {
    constructor(isSingleton) { super(isSingleton); }

    listen(model) {
        switch(true) {
        case is(model, HomeModel): {
            prop(this._view, { list: model.list });
            break;
        }
        case is(model, HomeDetailModel): { 
            const { title, memo } = model;
            prop(this._view, { title, memo });
            break;
        }
        }
    }

    detail(id) {
        prop(this, { _id: id, _view: new HomeDetailView(this, true)});
        const model = new HomeModel(true).get(id);
        model.addPresenter(this);
        model.notify();
    }

    $removeDetail() {
        this.$remove(this._id);
        this.$list();
    }

    $editDetail() {
        const model = new HomeModel(true).get(this._id);
        model.addPresenter(this);
        const { title, memo } = this._view;
        model.edit(title, memo);
    }

    base() {
        prop(this, { _view: new HomeBaseView(this, true)});
        const model = new HomeModel(true);
        model.addPresenter(this);
        model.notify();
    }

    $remove(id) {
        const model = new HomeModel(true);
        model.remove(id);
    }

    $list() { app.route('home'); }

    $detail(id) { app.route('home:detail', id); }
};

// application codes
let idGenerator = 1;
const app = new App('#stage');
app.add('home:detail', () => new Home(true));
app.route('home');
