# Prototype

Address.java

```java
package Prototype;

public class Address implements Cloneable {
    private String street;
    private int number;
    private String zip;

    public Address(String street, int number, String zip) {
        this.street = street;
        this.number = number;
        this.zip = zip;
    }

    public Address clone() throws CloneNotSupportedException {
        return (Address) super.clone();
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    @Override
    public String toString() {
        return "Address{" +
                "street='" + street + '\'' +
                ", number=" + number +
                ", zip='" + zip + '\'' +
                '}';
    }
}
```

Eployee.java

```java
package Prototype;

public abstract class Employee implements Cloneable {
    private String firstName;
    private String lastName;
    private Address address;
    private String position;

    public Employee(String firstName, String lastName, Address address, String position) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.position = position;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String occupation) {
        this.position = occupation;
    }

    public Employee clone() throws CloneNotSupportedException {
        Employee clone = (Employee) super.clone();
        //clone.setAddress(new Address(address.getStreet(), address.getNumber(), address.getZip()));
        clone.setAddress(address.clone());
        return clone;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", address=" + address +
                ", position='" + position + '\'' +
                '}';
    }
}
```

HospitalEmployee.java

```java
package Prototype;

public class HospitalEmployee extends Employee {
    public HospitalEmployee(String firstName, String lastName, Address address, String position) {
        super(firstName, lastName, address, position);
    }

    public HospitalEmployee clone() throws CloneNotSupportedException {
        return (HospitalEmployee) super.clone();
    }
}
```

Main.java

```java
package Prototype;

public class Main {

    public static void main(String[] args) throws CloneNotSupportedException {
        HospitalEmployee employeeNr1 = new HospitalEmployee("Petra", "Schmitz", new Address("Mondstraße", 2, "39475"), "Ärztin");
        HospitalEmployee employeeNr2 = employeeNr1.clone();

        System.out.println(employeeNr1);
        System.out.println(employeeNr2);
        employeeNr2.setFirstName("Franziska");
        employeeNr2.setLastName("Bauer");
        employeeNr2.setAddress(new Address("Tulpenstraße", 13, "74562"));
        employeeNr2.setPosition("Krankenschwester");
        System.out.println(employeeNr1);
        System.out.println(employeeNr2);
    }
}
```