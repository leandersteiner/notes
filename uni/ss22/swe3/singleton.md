# Singleton

- Einzelne Instanz einer Klasse
- Möglichtkeit weitere Prüfungen bei instanziierung

## Pro

- Ersetzen globale Variablen
- Lazy Instanziierung

## Contra

- Wartbarkeit
- Bedingungslose und globale	Verfügung

## Beispiel

### Regulär

```java
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
```

### Enum

```java
public enum EnumExample {
  INSTANCE;

  private double interestRate;

  double getInterestRate() {
    return interestRate;
  }

  void setInterestRate(double interestRate) {
    this.interestRate = interestRate;
  }
}
```

### Demo

```java
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

```
