const Task = class {
    static title(a, b) {
        return a.sortTitle(b);
    }

    static date(a, b) {
        return a.sortDate(b);
    }

    constructor(title) {
        if (!title) 
            throw "invalid title";
        else 
            this._title = title;
        this._list = [];
    }

    add(task) {
        if (task instanceof Task) 
            this._list.push(task);
        else 
            throw "invalid";
    }

    remove(task) {
        const list = this._list;
        if (list.includes(task)) 
            list.splice(list.indexOf(task), 1);
    }

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

    isComplete() {
        throw "override";
    }

    sortTitle() {
        throw "override";
    }

    sortDate() {
        throw "override";
    }
};
  
const TaskItem = class extends Task {
    constructor(title, date = new Date()) {
        super(title);
        this._date = date;
        this._isComplete = false;
    }

    isComplete() {
        return this._isComplete;
    }

    sortTitle(task) {
        return this._title > task._title;
    }

    sortDate(task) {
        return this._date > task._date;
    }

    toggle() {
        this._isComplete = !this._isComplete;
    }
};
  
const TaskList = class extends Task {
    constructor(title) {
        super(title);
    }

    isComplete() {}

    sortTitle() {
        return this;
    }
    sortDate() {
        return this;
    }
};

const Renderer = class {
    constructor(list) {
        this._list = list;
        this._sort = Task.title;
    }

    add(parent, title, date) {
        parent.add(new TaskItem(title, date));
        this.render();
    }

    remove(parent, task) {
        parent.remove(task);
        this.render();
    }

    toggle(task) {
        if (task instanceof TaskItem) {
            task.toggle();
            this.render();
        }
    }

    render() {
        throw 'render() 메소드가 구현되어 있지 않습니다.';
    }
};

const DomRenderer = class extends Renderer {
    constructor(list, parent) {
        super(list);
        this._parent = parent;
    }

    render() {
        const parent = this._parent;
        parent.innerHTML = "";

        /*
            btn을 createElement에서 template HTML로 대체하였음.
        */
        parent.appendChild(
            ["title" , "date"].reduce((nav, c) => {
                const templateBtn = document.getElementById(this._sort === c ? "navbtn_selected_template" : "navbtn_template").content.cloneNode(true);
                templateBtn.querySelector('button').innerHTML = c;
                templateBtn.addEventListener("click",  () => ((this._sort = Task[c]), this.render()));
                nav.appendChild(templateBtn);

                return nav;
            }, el('nav'))
        );
        this._render(parent, this._list, this._list.getResult(this._sort), 0);
    }

    _render(base, parent, { item, children }, depth) {
        const temp = [];
        console.log(base);
        if (depth !== 0) 
            base.querySelector('section').style.paddingLeft = depth * 10 + "px";
        if (item instanceof TaskList) {
            /*
                List의 템플릿을 사용함
            */
            const templateList = document.getElementById("list_template").content.cloneNode(true);
            templateList.querySelector('h2').innerHTML = item._title;
            temp.push(templateList);
        } else {
            /*
                Item의 템플릿을 사용함
            */
            const templateItem = document.getElementById(item.isComplete() ? "item_completed_template" : "item_template").content.cloneNode(true);
            templateItem.querySelector('h3').innerHTML = item._title;
            templateItem.querySelector('time').innerHTML = item._date.toString();
            templateItem.querySelector('time').dateTime = item._date.toString();
            templateItem.querySelector('.toggleBtn').addEventListener("click", () => this.toggle(item));
            templateItem.querySelector('.removeBtn').addEventListener("click", () => this.remove(parent, item));
            temp.push(templateItem);
        }
        /*
            SubItem의 템플릿을 사용함
        */
        const sub = document.getElementById("item_sub_template").content.cloneNode(true);
        sub.querySelector('button').addEventListener("click", e => this.add(item, e.target.previousSibling.value));

        children.forEach(v => {
            this._render(sub, item, v, depth + 1);
        });
        
        temp.push(sub);
        temp.forEach(v => base.appendChild(v));
    }
};

const el = (tag, ...attr) => {
    const el = document.createElement(tag);
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

const list1 = new TaskList('s75');
const item1 = new TaskItem("3강교안작성");
const sub1 = new TaskItem("코드정리");
const subsub1 = new TaskItem("subsub1");

list1.add(item1);
item1.add(sub1);
sub1.add(subsub1);

list1.getResult(Task.title);

const todo = new DomRenderer(list1, document.getElementById('list'));
todo.render();