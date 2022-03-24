# Abstract Factory

Das Abstract Factory Pattern wird dazu verwendet, um während der Laufzeit des Programms mehrere Objekte einer Produktfamilie zu erzeugen.

## Pro

- Client ist entkoppelt
- Erweiterbarkeit (weitere Produktfamilien können einfach hinzugefügt werden)

## Contra

- Erweiterbarkeit (Neue Produkte zu Familien hinzufügen bricht bestehenden Code)

```java
QuadrocopterFactory factory = new QuadroFactory();
ControllerBoard controller = new ControllerBoard(factory);

QuadrocopterFactory factory2 = new FlyFactory();
ControllerBoard controller2 = new ControllerBoard(factory2);
```

```java
public interface QuadrocopterFactory {
    Engine createEngine();

    Regulator createRegulator(Engine engine);
}
```

```java
public class QuadroFactory implements QuadrocopterFactory {
    @Override
    public Engine createEngine() {
        System.public class QuadroFactory implements QuadrocopterFactory {
    @Override
    public Engine createEngine() {
        System.out.println("Die QuadroEngine wurde erfolgreich erzeugt.");
        return new QuadroEngine();
    }

    @Override
    public Regulator createRegulator(Engine engine) {
        System.out.println("Der QuadroRegulator wurde erfolgreich erzeugt.");
        return new QuadroRegulator(engine);
    }
}out.println("Die QuadroEngine wurde erfolgreich erzeugt.");
        return new QuadroEngine();
    }

    @Override
    public Regulator createRegulator(Engine engine) {
        System.out.println("Der QuadroRegulator wurde erfolgreich erzeugt.");
        return new QuadroRegulator(engine);
    }
}
```

Engine & Regulator sind abstrakte Klassen.
Die Produktfamilien erweitern diese Klassen.
Diese Klassen werden am Ende von den konkreten Fabriken instanziiert.
Die Fabriken geben aber wieder die generellere Oberklasse zurück.

```java
public class ControllerBoard {
    private QuadrocopterFactory usedFactory;
    private Regulator[] regulator;
    private Engine[] engine;

    public ControllerBoard(QuadrocopterFactory usedFactory) {
        this.usedFactory = usedFactory;
        this.regulator = new Regulator[4];
        this.engine = new Engine[4];
        createQuadrocopterParts();
    }

    private void createQuadrocopterParts() {
        for (int i = 0; i < 4; i++) {
            engine[i] = usedFactory.createEngine();
            regulator[i] = usedFactory.createRegulator(engine[i]);
        }

    }
}
```

Die Klasse ControllerBoard benutzt dabei die Factory und erstellt daraus die für die Quadrocopter benötigten Teile.
Die Entkopplung erreicht man, da der ControllerBoard Klasse egal ist, welche der beiden Factories übergeben wird.