package trial;

public class Court {
	
	private static Judge judge;
	private static Witness witness;
	private static ProsecutionOfficer officer;
	
	// 재판 협력 모델
	public static void main(String[] args) {
		System.out.println("--이번 재판은 앨리스가 증인 역할을 할 것입니다.--");
		witness = new Alice();
		
		System.out.println("--이번 재판은 토끼가 검찰 공무원 역할을 할 것입니다.--");
		officer = new Rabbit();

		System.out.println("--이번 재판은 왕이 판사 역할을 할 것입니다.--");
		judge = new King();
		
		judge.judge();
	}
	
	// 아래 두 메소드는 의존 관계 최소화를 위한 유틸형 메소드입니다.
	public static ProsecutionOfficer getProsecutionOfficerForTheTrial() {
		return officer;
	}
	
	public static Witness getWitnessForTheTrial() {
		return witness;
	}
}
