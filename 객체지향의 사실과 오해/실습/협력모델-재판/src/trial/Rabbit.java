package trial;

// �䳢�� ���� �������� ������ ������ �� �ִ�.
public class Rabbit implements ProsecutionOfficer {

	// ���� �������� ���� ��ü�� ���� �˾ƾ� �Ѵ�.
	private Witness witness = Court.getWitnessForTheTrial();
	
	@Override
	public void askForWitnessToCome() {
		rabbitSay("������ ������ �⼮�϶�");
		witness.enterCourt();
	}
	
	private void rabbitSay(String sentence) {
		System.out.println("�䳢: " + sentence);
	}
}
