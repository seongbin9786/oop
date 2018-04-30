package trial;

public class Court {
	
	private static Judge judge;
	private static Witness witness;
	private static ProsecutionOfficer officer;
	
	// ���� ���� ��
	public static void main(String[] args) {
		System.out.println("--�̹� ������ �ٸ����� ���� ������ �� ���Դϴ�.--");
		witness = new Alice();
		
		System.out.println("--�̹� ������ �䳢�� ���� ������ ������ �� ���Դϴ�.--");
		officer = new Rabbit();

		System.out.println("--�̹� ������ ���� �ǻ� ������ �� ���Դϴ�.--");
		judge = new King();
		
		judge.judge();
	}
	
	// �Ʒ� �� �޼ҵ�� ���� ���� �ּ�ȭ�� ���� ��ƿ�� �޼ҵ��Դϴ�.
	public static ProsecutionOfficer getProsecutionOfficerForTheTrial() {
		return officer;
	}
	
	public static Witness getWitnessForTheTrial() {
		return witness;
	}
}
