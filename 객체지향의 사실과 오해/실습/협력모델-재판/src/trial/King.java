package trial;

/*
 * 왕 객체
 * 판사 역할을 수행할 수 있다.
 */
public class King implements Judge {

	// 판사는 검찰 공무원 객체에 관해 알아야 한다.
	private ProsecutionOfficer officer = Court.getProsecutionOfficerForTheTrial();
	
	// 판사는 증인 객체에 관해 알아야 한다.
	private Witness witness = Court.getWitnessForTheTrial();
	
	// 판사는 재판의 책임(=의무,역할)이 있다.
	@Override
	public void judge() {
		kingSay("재판을 시작한다.");
		
		// 판사는 검찰 공무원 객체의 행동을 시작시켜야 한다.
		kingSay("검찰 공무원은 증인이 법정에 출석하도록 하라.");
		officer.askForWitnessToCome();
		
		// 판사는 증인 객체의 행동을 시작시켜야 한다.
		kingSay("증인은 증언을 시작하라.");
		witness.witness();
		
		// 왕이 판결을 내린다.
		kingSay("좋다. 증인의 진술을 인정하여 피고인에게 징역 3년을 선고한다.");
		kingSay("이것으로 재판을 마친다.");
	}
	
	private void kingSay(String sentence) {
		System.out.println("왕: " + sentence);
	}
}
