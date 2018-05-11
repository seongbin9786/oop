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

// 실제로 그리는 테이블 클래스를 리턴하는 익명 클로저 함수이다.
const Table = (() => {

    const Private = Symbol();

    // JS의 함수 내에서 선언하는 모든 것은 private scope이다.
    // JS에서는 접근제한자가 없기 때문에 클로저로 private scope를 구현해야 한다.
    // 이렇게 생긴 공간(함수 + private scope)을 클로저라고 한다.
    return class {

        constructor(parent) {
            if (!parent || typeof parent != 'string')
                throw '정상적인 부모 선택자가 아닙니다.';
            this[Private] = { parent };
        }

        // 동기 코드라고 생각할 수 있지만, 실제로는 비동기적 실행이다.
        // Promise callback인데 syntactic sugar이다.
        // fetch(url).then(response => response.json()).then(json => _render(json));
        async load(json) {
            /*
            const response = await fetch(url);
            if (!response.ok)
                throw '데이터 로딩 도중 서버로부터 정상적인 응답을 받지 못했습니다.';

            const json = await response.json();
            */
            const { title, header, items } = json;
            if (!items.length || !header.length || !title.length)
                throw '데이터 로딩 도중 잘못된 데이터가 존재합니다.';

            // Object.assign(this[Private], { title, header, items });
            this[Private] = { ...this[Private], title, header, items };
            this._render();
        }

        _render() {
            //부모, 데이터 체크
            const fields = this[Private], parent = document.querySelector(fields.parent);
            if (!parent)
                throw '부모 선택자에 해당하는 DOM 요소가 없습니다.';

            if (!fields.items || !fields.items.length) {
                parent.innerHTML = 'no data';
                return;
            }
            parent.innerHTML = '';

            //table 생성
            const table = document.createElement('table');
            const caption = document.createElement('caption');
            table.appendChild(caption);

            //캡션을 title로
            caption.innerHTML = fields.title;

            //header를 thead로
            table.appendChild(
                //reduce(callback(accumulator, currentValue));
                //accumulator = initialValue or 누적 계산값
                //header의 currentValue
                fields.header.reduce((thead, data) => {
                    const th = document.createElement('th');
                    th.innerHTML = data;
                    thead.appendChild(th);

                    return thead;
                }, document.createElement('thead')) // initialValue
                // initialValue가 없는 경우, 배열의 첫번째 값이 된다.
                // 이 때 currentValue는 배열의 두번째 값부터 시작한다.
                // 그렇기 때문에, initialValue가 없고, 빈 배열인 경우 TypeError가 발생한다.
            );

            //부모에 table 삽입
            parent.appendChild(
                // table에 tr 삽입
                fields.items.reduce((table, row) => {
                    //items를 tr로
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
    };
})();

// 실행할 코드
const table = new Table("#data");
// REFACTORING v1: 테이블이 더 이상 로딩 역할을 가지면 안 된다.
table.load(jsonData); // load 이후 render가 없다. load 이후 render해야한다. [why? 비동기여서]