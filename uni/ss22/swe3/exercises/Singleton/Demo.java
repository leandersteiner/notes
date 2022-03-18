public class Demo {

	public static void main(String[] args) {

		StandardInterestRate test = StandardInterestRate.getInstance();
		System.out.println(test.getInterestRate());
		test.setInterestRate(5.0);
		System.out.println(test.getInterestRate());

		StandardInterestRate test2 = StandardInterestRate.getInstance();
		System.out.println(test2.getInterestRate());

    EnumExample test3 = EnumExample.INSTANCE;
    System.out.println(test3.getInterestRate());
		test3.setInterestRate(5.0);
		System.out.println(test3.getInterestRate());

		EnumExample test4 = EnumExample.INSTANCE;
		System.out.println(test4.getInterestRate());
	}
}