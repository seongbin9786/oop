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

const App = class {
    constructor(_parent =err()) {
        prop(this, { _parent, _table: new Map });
    }
    
    add(k = err(), vm = err(), view = err()) {
        this._table.set(k, [vm, view]);
    }

    route(path = err(), ...args) {
        const [k, action = 'base'] = path.split(':');
        if (!this._table.has(k)) return;
        const [vm, view] = this._table.get(k).map(f=>f());
        view.viewModel = vm;
        vm[action](...args);
        append(attr(sel(this._parent), 'innerHTML', ''), view.view);
    }
};

const Observer = class {
    observe(v) { override(v); }
};

const Subject = class extends Set {
    add(v) {
        if (!is(v, Observer)) err();
        super.add(v);
        return this;
    }

    delete(v) {
        if (!is(v, Observer)) err();
        super.delete(v);
    }

    has(v) {
        if(!is(v, Observer)) err();
        return super.has(v);
    }

    notify(...args) {
        console.log('notify!', args.length ? args : 'no-args');
        this.forEach(v => args.length ? v.observe(...args) : v.observe(this));
    }
};

const View = class extends Observer {
    constructor(_view = err(), isSingleton = false) {
        super();
        return prop(isSingleton ? singleton.getInstance(this) : this, { _view });
    }

    get viewModel() { return this._viewModel; }
    set viewModel(_viewModel) { 
        prop(this, { _viewModel });
        _viewModel.add(this); // 뷰모델을 뷰에 등록할 때 뷰모델이 뷰의 observer가 됨
    }
    observe(...args) { this.render(...args); }
    render() { override(); }
    get view() { return this._view; }
};

const HomeBaseView = class extends View {
    constructor(isSingleton) {
        super(el('ul'), isSingleton);
    }
    
    render(list) {
        const { viewModel, view } = this;
        append(el(view, 'innerHTML', ''), ...list.map(v => append(
            el('li'),
            el('a', 'innerHTML', v.title, 'addEventListener', ['click', () => viewModel.$detail(v.id)]),
            el('button', 'innerHTML', 'X', 'addEventListener', ['click', () => viewModel.$remove(v.id)])
        )));
    }
};

const HomeDetailView = class extends View {
    constructor(isSingleton) {
        super(el('section'), isSingleton);
        const { view, viewModel } = this;
        append(el(view, 'innerHTML', ''),
            el('input', '@cssText', 'display: block', 'className', 'title'),
            el('textarea', '@cssText', 'display: block', 'className', 'memo'),
            el('button', 'innerHTML', 'edit', 'addEventListener', ['click', () => viewModel.$edit(sel('.title', view).value, sel('.memo', view).value)]),
            el('button', 'innerHTML', 'delete', 'addEventListener', ['click', () => viewModel.$remove()]),
            el('button', 'innerHTML', 'list','addEventListener', ['click', () => viewModel.$list()])
        );
    }

    render(title, memo) {
        sel('.title', this.view).value = title;
        sel('.memo', this.view).value = memo;
    }
};

const Model = class extends Subject {
    constructor(isSingleton) {
        super();
        if(isSingleton) return singleton.getInstance(this);
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
        const { _list: list } = this;
        if (!list.some((v, i) => {
            if (v.id == id) {
                list.splice(i, 1);
                return true;
            }
        })) err();

        this.notify();
    }

    get list() { return this._list; }

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
        this.notify();
    }

    get title() { return this._title; }
    get id() { return this._id; }
    get memo() { return this._memo; }
};

const ViewModelObserver = class extends Observer {
    constructor(_viewModel) {
        super();
        prop(this, { _viewModel });
    }

    observe(v) { this._viewModel.listen(v); }
};

const ViewModel = class extends Subject {
    constructor(isSingleton) {
        super();
        const target = isSingleton ? singleton.getInstance(this) : this;
        prop(target, { _observer: new ViewModelObserver(target) });

        console.log('[ViewModel constructor]', target);
        return target;
    }

    get observer() { return this._observer; }
    listen(model) { override(model); }
};

const ListVM = class extends ViewModel {
    constructor(isSingleton) {
        super(isSingleton);
    }

    base() {
        const model = new HomeModel(true);
        model.add(this.observer);
        model.notify();

        console.log('[ListVM] base()', model);
    }

    listen(model) {
        if (!is(model, HomeModel)) err();
        this.notify(model.list);
    }

    $detail(id) { app.route('detail', id); }
    
    $remove(id) {
        const model = new HomeModel(true);
        model.remove(id);
    }
};

const DetailVM = class extends ViewModel {
    constructor(isSingleton) { super(isSingleton); }

    base(id) {
        prop(this, { _id: id });
        const model = new HomeModel(true).get(id);
        model.add(this.observer);
        model.notify();
    }

    listen(model) {
        if (!is(model, HomeDetailModel)) err();
        this.notify(model.title, model.memo);
    }

    $edit(title, memo) {
        const model = new HomeModel(true).get(this._id);
        model.edit(title, memo);
    }

    $remove() {
        const model = new HomeModel(true);
        model.remove(this._id);
        this.$list();
    }

    $list() { app.route('list'); }
};

// application codes
let idGenerator = 1;
const app = new App('#stage');
app.add('list', () => new ListVM(true), () => new HomeBaseView(true));
app.add('detail', () => new DetailVM(true), () => new HomeDetailView(true));
app.route('list');
