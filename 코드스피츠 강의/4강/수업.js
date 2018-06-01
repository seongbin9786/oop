const Observer = class {
    observe() { override(); }
};

const Subject = class {
    constructor() {
        this._observers = new Set;
    }

    addObserver(o) {
        validateInstance(o, Observer);
        this._observers.add(o);
    }

    removeObserver(o) {
        validateInstance(o, Observer);
        this._observers.delete(o);
    }

    notify() {
        console.log('notifier:', this);
        this._observers.forEach(o => o.observe());
    }
};

const TaskObserver = class extends Observer {
    constructor(_task) {
        super();
        prop(this, { _task });
    }

    observe() {
        console.log('observer:', this);
        this._task.notify();
    }
};

const Task = class extends Subject {
    static title(a, b) { a.sortTitle(b); }
    static date(a, b) { a.sortDate(b); }

    constructor(_title = err(), _date = new Date()) {
        super();
        prop(this, { _title, _date, _list: [], _observer: new TaskObserver(this) });
    }

    get title() { return this._title; }
    get date() { return this._date.toUTCString(); }

    add(task) {
        validateInstance(task, Task);
        this._list.push(task);
        task.setParent(this);
        task.addObserver(this._observer);
        this.notify();
    }

    remove(task) {
        const list = this._list;
        if (!list.includes(task)) err();
        list.splice(list.indexOf(task), 1);
        task.removeObserver(this._observer);
        this.notify();
    }

    // Composite의 핵심
    getResult(sort, stateGroup) {
        const list = this._list;
        return {
            item: this,
            children: (!stateGroup
                ? [...list].sort(sort)
                : [
                    ...list.filter(v => !v.isComplete()).sort(sort),
                    ...list.filter(v => v.isComplete()).sort(sort)
                ]
            ).map(v => v.getResult(sort, stateGroup))
        };
    }

    accept(sort, stateGroup, visitor) {
        visitor.start(sort, stateGroup, this);
        this.getResult(sort, stateGroup).children.forEach(
            ({ item }) => item.accept(sort, stateGroup, visitor)
        );
        visitor.end();
    }

    isComplete() { override(); }
    sortTitle() { override(); }
    sortDate() { override(); }
};
  
const TaskItem = class extends Task {
    constructor(title, date = new Date(), parent = null) {
        super(title, date);
        this._isComplete = false;
        this._parent = parent;
    }

    setParent(parent) { console.log('setParent:', parent); this._parent = parent; }
    getParent() { return this._parent; }
    isComplete() { return this._isComplete; }
    sortTitle(task) { return this._title > task._title; }
    sortDate(task) { return this._date > task._date; }
    toggle() {
        this._isComplete = !this._isComplete;
        this.notify();
    }
};

const TaskList = class extends Task {
    constructor(title, date) {
        super(title, date);
    }

    isComplete() { override(); }
    sortTitl() { return this; }
    sortDate() { return this; } 
};

const Visitor = class {
    set renderer(v) { this._renderer = v; }
    reset() { override(); }

    operation(sort, stateGroup, task) {
        this._start(sort, stateGroup, task);
        task.getResult(sort, stateGroup).children.forEach(
            ({ item }) => this.operation(sort, stateGroup, item)
        );
        this._end();
    }

    _start(sort, stateGroup, task) { override(); }
    _end() { override(); }
};

const DomVisitor = class extends Visitor {
    constructor(_parent) {
        super();
        prop(this, { _parent });
    }

    reset() {
        this._current = el(sel(this._parent), 'innerHTML', ''); 
    }

    _start(sort, stateGroup, task) {
        validateInstance(this._renderer, Renderer);
        switch(true) {
        case is(task, TaskItem): this._item(task); break;
        case is(task, TaskList): this._list(task); break;
        }
        this._current = this._current.appendChild(
            el('section',
                '@marginLeft', '15px',
                'appendChild', el('input', 'type', 'text'),
                'appendChild', el('button', 'innerHTML', 'addTask',
                    'addEventListener', ['click', e => this._renderer.add(task, e.target.previousSibling.value)])
            )
        );
    }

    _end() { 
        this._current = this._current.parentNode; 
    }

    _list(task) {
        this._current.appendChild(el('h2', 'innerHTML', task.title));
    }

    _item(task) {
        [
            el('h3', 'innerHTML', task.title, '@textDecoration', task.isComplete() ? 'line-through' : 'none'),
            el('time', 'innerHTML', task.date, 'datetime', task.date),
            el('button', 'innerHTML', task.isComplete() ? 'progress' : 'complete', 'addEventListener', ['click', () => this._renderer.toggle(task)]),
            el('button', 'innerHTML', 'remove', 'addEventListener', ['click', () => this._renderer.remove(task.getParent(), task)])
        ].forEach(v => this._current.appendChild(v));
    }
};

const DomSearchVisitor = class extends Visitor {
    constructor(_parent) {
        super();
        prop(this, { _parent });
    }

    reset() {
        this._current = el(sel(this._parent), 'innerHTML', ''); 
    }

    search() {
        
    }

    _start(sort, stateGroup, task) {
        validateInstance(this._renderer, Renderer);
        switch(true) {
        case is(task, TaskItem): this._item(task); break;
        case is(task, TaskList): this._list(task); break;
        }
        this._current = this._current.appendChild(
            el('section',
                '@marginLeft', '15px',
                'appendChild', el('input', 'type', 'text'),
                'appendChild', el('button', 'innerHTML', 'addTask',
                    'addEventListener', ['click', e => this._renderer.add(task, e.target.previousSibling.value)])
            )
        );
    }

    _end() { 
        this._current = this._current.parentNode; 
    }

    _list(task) {
        this._current.appendChild(el('h2', 'innerHTML', task.title));
    }

    _item(task) {
        [
            el('h3', 'innerHTML', task.title, '@textDecoration', task.isComplete() ? 'line-through' : 'none'),
            el('time', 'innerHTML', task.date, 'datetime', task.date),
            el('button', 'innerHTML', task.isComplete() ? 'progress' : 'complete', 'addEventListener', ['click', () => this._renderer.toggle(task)]),
            el('button', 'innerHTML', 'remove', 'addEventListener', ['click', () => this._renderer.remove(task.getParent(), task)])
        ].forEach(v => this._current.appendChild(v));
    }
};

const Renderer = class extends TaskObserver {
    // require == mandatory
    constructor(_list = err(), _visitor = err()) {
        super();
        
        prop(this, { _list, _sort: 'title', _visitor: prop(_visitor, { renderer: this })});
        _list.addObserver(this);
    }
    
    observe() {
        this.render();
    }

    add(parent, title, date) {
        validateInstance(parent, Task);
        parent.add(new TaskItem(title, date, parent));
    }

    remove(parent, task) {
        console.log('[remove] parent:', parent);
        validateInstance(parent, Task);
        validateInstance(task, Task);
        parent.remove(task);
    }

    toggle(task) {
        console.log('[toggle] task:', task.isComplete());
        validateInstance(task, TaskItem);
        task.toggle();
    }

    render() {
        this._visitor.reset();
        this._visitor.operation(Task[this._sort], true, this._list);
        // this._list.accept(Task[this._sort], true, this._visitor);
        // Reverse Visitor Pattern
    }
};

/* 유틸리티 함수들 */
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
    return el;
};
const sel = (v, el = document) => el.querySelector(v);
const err = (v = 'invalid') => { throw v; };
const override = () => err('override');
const prop = (t, p) => Object.assign(t, p);
const is = (t, p) => t instanceof p;
function validateInstance(ins, clazz) {
    if(!is(ins, clazz)) throw 'validateInstance failed: ' + ins;
}

const list1 = new TaskList('s75');
const item1 = new TaskItem("3강교안작성");
const sub1 = new TaskItem("코드정리");
const subsub1 = new TaskItem("subsub1");

list1.add(item1);
item1.add(sub1);
sub1.add(subsub1);

const todo = new Renderer(list1, new DomVisitor('#list'));
todo.render();