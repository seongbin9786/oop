6강
====

1. MVP는 View가 getter/setter를 생성하고, Presenter가 View의 메소드를 실행해서 데이터를 전달한다. 따라서 View는 Presenter와 결합하지만 UI에서 필연적으로 발생하는 액션을 Presenter에 위임하는 수준에서 끝날 수 있고, View는 Model과 결합하지 않게 된다.

2. 서버에서 사용되는 MVC와 클라이언트(모바일 디바이스에서 사용되는 Android, iOS 등과 브라우저를 일컬음)에서 사용되는 MVC가 다른 것 같다. 왜 그렇게 생각하냐면, MVC 강의 및 관련된 내용을 정리한 블로그들을 살펴보면 [1] View와 Model이 강하게 결합된다고 하는데, Server-side MVC에서는 View와 Model은 결합이 된다고 보기 애매하며, ((4)에서 설명) [2] View 코드가 많은 것에 비해 Model이 작다고 하는데 Front-end 입장에서 데이터만 들어오는 Model에 비해 View 코드가 압도적인 것은 사실이지만, Server-side에서는 Model 계층의 비즈니스 로직이 View 코드보다 작을 수가 없다고 생각한다. (Model이 바뀔 때에 SQL 까지 생각한다면 절대 Model이 더 작을 수 없다.)

3. Server-side MVC에서 뷰를 구성하는 방법은 크게 2가지가 있다.

4. 첫 번째는 Controller에서 Model을 서비스로부터 받아온 후 (스프링 기준으로는) ViewResolver에 View와 Model을 넘기는 방법이다. View에는 render(Map<String, ?> model, ...) 메소드가 존재하므로 View가 Model을 받아서 렌더링하는 책임이 있으므로 View와 Model은 분명히 결합되어 있다. 이 때 render는 Spring 프레임워크에 구현되어 있는데 이게 가능한 이유는 View에서 정의하는 내용 중 Model과 관계된 부분은 프레임워크에서 제공한 문법(예: JSP라면 JSTL)을 통해서만 Model에서 가져오기 때문이다. 프로그래머가 render를 정의하지 않는다. 따라서 '특정 Model'과 '특정 View'가 View 코드 내부에서 결합되는 일은 있을 수 없다. 따라서 일반적인 MVC와 같이 View와 Model이 결합되긴 하지만 코드를 작성하고 유지보수하는 입장에서 결합된다고 하긴 어렵다고 생각한다.

5. 두 번째는 REST API를 구성하는 방법이며 이 때는 데이터만 JSON 형식으로 반환하기에 Server-side MVC에서는 View 부분이 사라지게 된다.

6. 구글링을 해봤더니, client-side MVC는 클라이언트단에서 완전히 MVC를 구현한 것에 서버단에서 데이터만 받아오는 것이라고 한다. 이해를 위해서 Client-side MVC를 사용하는 AngularJS와 EmberJS의 예제 코드를 확인봤다.

7. 