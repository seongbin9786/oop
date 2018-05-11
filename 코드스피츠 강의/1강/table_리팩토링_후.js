const jsonData = {
    "title": "TIOBEIndex for June 2017",
    "header": ["Jun-17", "Jun-16", "Change", "Programming Language", "Ratings", "Change"],
    "items": [
        [1, 1, "", "Java", "14.49%", "-6.30%"],
        [2, 2, "", "C", "6.85%", "-5.53%"],
        [3, 3, "", "C++", "5.72%", "-0.48%"],
        [4, 4, "", "Python", "4.33%", "0.43%"],
        [5, 5, "", "C#", "3.53%", "-0.26%"],
        // 아래 row 데이터에 이상이 있음.
        [6, 9, "", "change", "Visual Basic .NET", "3.11%", "0.76%"],
        [7, 7, "", "JavaScript", "3.03%", "0.44%"],
        [8, 6, "change", "PHP", "2.77%", "-0.45%"],
        [9, 8, "change", "Perl", "2.31%", "-0.09%"],
        [10, 12, "change", "Assembly language", "2.25%", "0.13%"],
        [11, 10, "change", "Ruby", "2.22%", "-0.11%"],
        [12, 14, "change", "Swift", "2.21%", "0.38%"],
        [13, 13, "", "Delphi/Object Pascal", "2.16%", "0.22%"],
        [14, 16, "change", "R", "2.15%", "0.61%"],
        [15, 48, "change", "Go", "2.04%", "1.83%"],
        [16, 11, "change", "Visual Basic,2.01%", "-0.24%"],
        [17, 17, "", "MATLAB", "2.00%", "0.55%"],
        [18, 15, "change", "Objective-C", "1.96%", "0.25%"],
        [19, 22, "change", "Scratch", "1.71%", "0.76%"],
        [20, 18, "change", "PL/SQL", "1.57%", "0.22%"]
    ]
};

// low-level 값 객체
// 값 검증을 하는 로직을 생성자에 넣음으로서,
// Info 타입을 사용하면 값 검증이 된 데이터이다.
class Info {
    constructor(json) {
        const { title, header, items } = json;
        if (!title || typeof title != 'string')
            throw 'title 데이터가 올바르지 않습니다.';

        if (!header || Array.isArray(header) || !header.length)
            throw 'header 데이터가 올바르지 않습니다.';

        if (!items || Array.isArray(items) || !items.length)
            throw 'items 데이터가 올바르지 않습니다.';

        items.forEach((v, idx) => {
            if (!Array.isArray(v) || v.length != header.length) {
                throw `잘못된 데이터를 발견하였습니다: ${idx}`;
            }
        });

        this._private = { title, header, items };
    }

    // JS의 getter는 arrow function을 사용할 수 없다.
    get title() {
        return this._private.title;
    }

    get header() {
        return this._private.header;
    }

    get items() {
        return this._private.items;
    }
}


// 값 객체
// JsonData, CsvData, XmlData
// 값 Validation을 여기서 수행해야 한다.
// 이후에는 Data라는 타입이 Validation이 됐음을 의미하게 된다.
class Data {

    // 모든 하위 객체는 Info 객체를 반환해야 한다.
    // 따라서 상위 클래스인 Data에서 이를 강제한다.
    async getData() {
        const json = await this._getData();
        return new Info(json);
    }

    // json을 반환한다.
    async _getData() {
        throw '하위 데이터 객체에서 오버라이딩하지 않았습니다.';
    }
}

class JsonData extends Data {

    constructor(json) {
        super();

        this.json = json;
    }

    async getData() {
        if (typeof this.json == 'string') {
            throw '올바른 JSON 데이터가 아닙니다.';
        }
        // if (typeof this.json == 'string') {
        // const response = await fetch(this._data);
        // return await response.json();
        //}
        return this.json;
    }
}

// 데이터를 전달 받아 화면에 그리는 객체
class Renderer {

    async render(data) {
        if (!(data instanceof Data))
            throw '올바른 형식의 데이터가 아닙니다.';

        this.info = await data.getData();
        this._render();
    }

    _render() {
        throw '하위 데이터 객체에서 오버라이딩하지 않았습니다.';
    }
}

// 데이터를 전달 받아 화면에 그리는 객체
class TableRenderer extends Renderer {

    constructor(parentSelector) {
        super();

        if (!parentSelector)
            throw '부모 선택자에 해당하는 DOM 요소가 없습니다.';

        this.parentSelector = parentSelector;
    }

    async _render() {
        const { title, header, items } = this.info;
        const parent = document.querySelector(this.parentSelector);

        if (!items || !items.length) {
            parent.innerHTML = 'no data';
            return;
        }
        parent.innerHTML = '';

        const table = document.createElement('table');
        const caption = document.createElement('caption');
        table.appendChild(caption);

        caption.innerHTML = title;

        table.appendChild(
            header.reduce((thead, data) => {
                const th = document.createElement('th');
                th.innerHTML = data;
                thead.appendChild(th);

                return thead;
            }, document.createElement('thead'))
        );

        parent.appendChild(
            items.reduce((table, row) => {
                table.appendChild(
                    row.reduce((tr, data) => {
                        const td = document.createElement('td');
                        td.innerHTML = data;
                        tr.appendChild(td);

                        return tr;
                    }, document.createElement('tr'))
                );
                return table;
            }, table)
        );
    }
}

// 실행할 코드
const data = new JsonData(jsonData);
const table = new TableRenderer("#data");
table.render(data);
