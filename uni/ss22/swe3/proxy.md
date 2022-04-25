# Proxy

Main.java

```java
package Proxy;

public class Main {
    public static void main(String[] args) {
        Downloadable javaEbook = new DownloadProduct("Java ist auch eine Insel");
        Customer hendrik = new Customer("Hendrik Schmitz");
        Customer maggie = new Customer("Maggie Smith");

        javaEbook.download(hendrik);
        javaEbook.download(hendrik);
        javaEbook.download(hendrik);
        javaEbook.download(hendrik);

        System.out.println();

        Downloadable patternEbook = new DownloadProductProxy("Design Patterns");
        patternEbook.download(hendrik);
        patternEbook.download(hendrik);
        patternEbook.download(hendrik);
        patternEbook.download(hendrik);

        patternEbook.download(maggie);

        javaEbook.download(hendrik);
        patternEbook.download(hendrik);

        patternEbook.download(maggie);
        patternEbook.download(maggie);
        patternEbook.download(maggie);
    }
}
```

Downloadable.java

```java
package Proxy;

public interface Downloadable {
    void download(Customer customer);
}
```

Customer.java

```java
package Proxy;

public class Customer {
    private String name;

    public Customer(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

DownloadProduct.java

```java
package Proxy;

public class DownloadProduct implements Downloadable {
    private String name;

    public DownloadProduct(String name) {
        this.name = name;
    }

    @Override
    public void download(Customer customer) {
        System.out.println(customer.getName() + " hat " + this.name + " heruntergeladen!");
    }

    public String getName() {
        return name;
    }
}
```

DownloadProductProxy.java

```java
package Proxy;

import java.util.HashMap;
import java.util.Map;

public class DownloadProductProxy implements Downloadable {
    private DownloadProduct product;
    private Map<Customer, Integer> downloads;

    public DownloadProductProxy(String name) {
        this.product = new DownloadProduct(name);
        this.downloads = new HashMap<>();
    }

    @Override
    public void download(Customer customer) {
        if (!downloads.containsKey(customer)) {
            downloads.put(customer, 1);
            product.download(customer);
            return;
        }

        if (downloads.get(customer) == 3) {
            System.out.println(customer.getName() + " hat " + this.product.getName() + " bereits 3 mal heruntergeladen!");
            return;
        }

        downloads.replace(customer, downloads.get(customer) + 1);
        product.download(customer);
    }
}
```