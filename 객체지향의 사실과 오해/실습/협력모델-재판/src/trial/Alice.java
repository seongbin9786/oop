package trial;

// �ٸ����� ���� ������ �� �� �ִ�.
public class Alice implements Witness {

	@Override
	public void enterCourt() {
		aliceSay("���� �ٸ����Դϴ�. �̹� ����� �����Դϴ�.");
	}

	@Override
	public void witness() {
		aliceSay("���� ���� ���� ���� ���� ���� ���� ���� ���� ���� ...");
	}

	private void aliceSay(String sentence) {
		System.out.println("�ٸ���: " + sentence);
	}
}
