4강 정리
========

1. Composite 패턴으로 구현된 클래스는 Visitor와의 관계가 자신이 Visitor를 받아들이는 형태가 된다.

2. Visitor는 자신에게 객체를 전달해주는 메소드만을 가진다. `access(item)`을 Composite 측에서 호출해주기 때문에 순차적으로 각각의 item에 접근할 수 있다.

3. `node.accept(visitor)` 하면, rootNode는 자신을 순회하며 `visitor.accept(this)`와 같이 호출하여 모든 객체를 전달한다.

4. 이벤트 버블링은 최하단 노드에서 최상위 노드로 전달되는 것이고, 캡처링은 반대이다.