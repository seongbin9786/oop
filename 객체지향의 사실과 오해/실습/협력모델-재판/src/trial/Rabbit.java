package trial;

// 토끼는 검찰 공무원의 역할을 수행할 수 있다.
public class Rabbit implements ProsecutionOfficer {

	// 검찰 공무원은 증인 객체에 관해 알아야 한다.
	private Witness witness = Court.getWitnessForTheTrial();
	
	@Override
	public void askForWitnessToCome() {
		rabbitSay("증인은 법정에 출석하라");
		witness.enterCourt();
	}
	
	private void rabbitSay(String sentence) {
		System.out.println("토끼: " + sentence);
	}
}
