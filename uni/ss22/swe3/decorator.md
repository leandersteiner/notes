# Decorator

Main.java

```java
package Decorator;

public class Main {
    public static void main(String[] args) {
        Coffee standard = new Standard();
        System.out.println(standard.getPrice());
        Coffee standardWithMilkFroth = new MilkFroth(standard);
        System.out.println(standardWithMilkFroth.getPrice());
        Coffee standardWithMilkFrothAndSoy = new Soy(standardWithMilkFroth);
        System.out.println(standardWithMilkFrothAndSoy.getPrice());

        System.out.println("-----");

        Coffee decaffinated = new Decaffinated();
        System.out.println(standard.getPrice());
        Coffee decaffinatedWithMilkFroth = new MilkFroth(decaffinated);
        System.out.println(standardWithMilkFroth.getPrice());
        Coffee decaffinatedWithMilkFrothAndSoy = new Soy(decaffinatedWithMilkFroth);
        System.out.println(decaffinatedWithMilkFrothAndSoy.getPrice());
    }
}
```

Coffee.java

```java
package Decorator;

public abstract class Coffee {
    private float price;

    public Coffee(float price) {
        this.price = price;
    }

    float getPrice() {
        return price;
    }
}
```

Extra.java

```java
package Decorator;

public abstract class Extra extends Coffee {
    private Coffee coffee;

    public Extra(Coffee coffee, float price) {
        super(price);
        this.coffee = coffee;
    }

    @Override
    float getPrice() {
        return super.getPrice() + coffee.getPrice();
    }
}
```