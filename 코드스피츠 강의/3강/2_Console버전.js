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
        else throw "invalid";
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

const ConsoleRenderer = class {
    constructor(list, parent) {
        this._list = list;
        this._sort = Task.title;
        this._parent = parent;
        this._buffer = '';
    }

    add(title, date) {
        parent.add(new TaskItem(title, date));
        this.render();
    }

    remove(task) {
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
        console.log("[title][date]");
        this._render(this._list.getResult(this._sort), 0);
    }

    _render({ item, children }, depth) {
        const padding = depth * 4;
        if (item instanceof TaskList) {
            this.SPACING(padding);
            this.APPEND(item._title + '\n');
        } else {
            this.SPACING(padding);
            this.APPEND(item._title + '\n');
            this.SPACING(padding);
            this.APPEND(item._date.toString());
            this.APPEND(item.isComplete() ? '[progress]' : '[complete]');
            this.APPEND('[remove]\n');
        }
        this.SPACING(padding);
        this.APPEND('[Add Task]');
        this.PRINT();
        children.forEach(v => {
            this._render(v, depth + 1);
        });
    }

    SPACING(padding) { 
        for (let i = 0; i < padding; i++) 
            this._buffer += ' '; 
    }
    
    APPEND(message) {
        this._buffer += message;
    }

    PRINT() { 
        console.log(this._buffer);
        this._buffer = ''; 
    }
};

const list1 = new TaskList('s75');
const item1 = new TaskItem("3강교안작성");
const sub1 = new TaskItem("코드정리");
const subsub1 = new TaskItem("subsub1");

list1.add(item1);
item1.add(sub1);
sub1.add(subsub1);

list1.getResult(Task.title);

const todo = new ConsoleRenderer(list1);
todo.render();
