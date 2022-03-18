public class StandardInterestRate {
  private static final StandardInterestRate instance = new StandardInterestRate();

  private double interestRate;

  public static StandardInterestRate getInstance() {
    return instance;
  }

  public double getInterestRate() {
    return interestRate;
  }

  public void setInterestRate(double interestRate) {
    this.interestRate = interestRate;
  }
}