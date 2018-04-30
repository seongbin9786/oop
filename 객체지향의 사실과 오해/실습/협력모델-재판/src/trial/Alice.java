package trial;

// 앨리스는 증인 역할을 할 수 있다.
public class Alice implements Witness {

	@Override
	public void enterCourt() {
		aliceSay("저는 앨리스입니다. 이번 사건의 증인입니다.");
	}

	@Override
	public void witness() {
		aliceSay("증언 증언 증언 증언 증언 증언 증언 증언 증언 증언 ...");
	}

	private void aliceSay(String sentence) {
		System.out.println("앨리스: " + sentence);
	}
}
