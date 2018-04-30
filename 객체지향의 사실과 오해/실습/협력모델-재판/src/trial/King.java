package trial;

/*
 * �� ��ü
 * �ǻ� ������ ������ �� �ִ�.
 */
public class King implements Judge {

	// �ǻ�� ���� ������ ��ü�� ���� �˾ƾ� �Ѵ�.
	private ProsecutionOfficer officer = Court.getProsecutionOfficerForTheTrial();
	
	// �ǻ�� ���� ��ü�� ���� �˾ƾ� �Ѵ�.
	private Witness witness = Court.getWitnessForTheTrial();
	
	// �ǻ�� ������ å��(=�ǹ�,����)�� �ִ�.
	@Override
	public void judge() {
		kingSay("������ �����Ѵ�.");
		
		// �ǻ�� ���� ������ ��ü�� �ൿ�� ���۽��Ѿ� �Ѵ�.
		kingSay("���� �������� ������ ������ �⼮�ϵ��� �϶�.");
		officer.askForWitnessToCome();
		
		// �ǻ�� ���� ��ü�� �ൿ�� ���۽��Ѿ� �Ѵ�.
		kingSay("������ ������ �����϶�.");
		witness.witness();
		
		// ���� �ǰ��� ������.
		kingSay("����. ������ ������ �����Ͽ� �ǰ��ο��� ¡�� 3���� �����Ѵ�.");
		kingSay("�̰����� ������ ��ģ��.");
	}
	
	private void kingSay(String sentence) {
		System.out.println("��: " + sentence);
	}
}
