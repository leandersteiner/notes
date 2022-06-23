# Code Examples

```java
(params) -> {function body}
(int x, int y) -> { return x + y; }
() -> {
  String msg = "Lambda";
  System.out.println(msg);
}

// Compiler-Error: incompatible types: Object is not a functional interface
Object greeter = () -> System.out.println("Lambda");
Object greeter = (Runnable) () -> System.out.println("Lambda");
```

```java
// SAM-Type (Single Abstract Method)
@FunctionalInterface
public interface Runnable {
  public abstract void run();
}
```

```java
new SAMType() {
  public void samTypeMethod(params) {
    // method body
  }
}

(params) -> { 
  // method body 
}
```

```java
(int x, int y) -> { return x + y; }
(long x) -> { return x * 2; }

(x, y) -> x + y
x -> x * 2
```

```java
button.setOnAction(new EventHandler<ActionEvent>() {
  @Override 
  public void handle(ActionEvent e) {
    label.setText("Accepted");
  }
});

button.setOnAction(e -> label.setText("Accepted"));
```

```java
Collections.sort(names, (str1, str2) -> Integer.compare(str1.lenght(), str2.length()));

public static Comparator<String> compareByLength() {
  return (str1, str2) -> Integer.compare(str1.length(), str2.length());
}

Collections.sort(names, compareByLenght());
```

```java
final List<String> names = ...
names.forEach(name -> System.out.println(name));
names.forEach(System.out::println)
```

```
Static method | String::valueOf | obj -> String.valueOf(obj)
Instance method of a type | String::compareTo | (str1, str2) -> str1.compareTo(str2)
Instance method of an object | person::getName | () -> person.getName()
Constructor | ArrayList::new | () -> new ArrayList<>()
```

```java
enum Color { RED, GREEN }

public static List<Apple> filterGreenApples(List<Apple> inventory) {
  List<Apple> result = new ArrayList<>();

  for(Apple apple: inventory){
    if(GREEN.equals(apple.getColor())) {
      result.add(apple);
    }
  }

  return result;
}

public static List<Apple> filterApplesByColor(List<Apple> inventory, Color color) {
  List<Apple> result = new ArrayList<>();

  for (Apple apple: inventory) {
    if ( apple.getColor().equals(color) ) {
      result.add(apple);
    }
  }

  return result;
}

List<Apple> greenApples = filterApplesByColor(inventory, GREEN);
List<Apple> redApples = filterApplesByColor(inventory, RED);


public static List<Apple> filterApplesByWeight(List<Apple> inventory, int weight) {
  List<Apple> result = new ArrayList<>();

  for (Apple apple: inventory){
    if ( apple.getWeight() > weight ) {
      result.add(apple);
    }
  }

  return result;
}

public static List<Apple> filterApples(List<Apple> inventory, Color color, int weight, boolean flag) {
  List<Apple> result = new ArrayList<>();

  for (Apple apple: inventory) {
    if ( (flag && apple.getColor().equals(color)) || (!flag && apple.getWeight() > weight) ){
      result.add(apple);
    }
  }

  return result;
}

List<Apple> greenApples = filterApples(inventory, GREEN, 0, true);
List<Apple> heavyApples = filterApples(inventory, null, 150, false);

public interface ApplePredicate{
  boolean test (Apple apple);
}

public class AppleHeavyWeightPredicate implements ApplePredicate {
  public boolean test(Apple apple) {
    return apple.getWeight() > 150;
  }
}
public class AppleGreenColorPredicate implements ApplePredicate {
  public boolean test(Apple apple) {
    return GREEN.equals(apple.getColor());
  }
}

public static List<Apple> filterApples(List<Apple> inventory, ApplePredicate p) {
  List<Apple> result = new ArrayList<>();
  for(Apple apple: inventory) {
    if(p.test(apple)) {
      result.add(apple);
    }
  }
  return result;
}

public class AppleRedAndHeavyPredicate implements ApplePredicate {
  public boolean test(Apple apple){
    return RED.equals(apple.getColor()) && apple.getWeight() > 150;
  }
}

List<Apple> redAndHeavyApples = filterApples(inventory, new AppleRedAndHeavyPredicate());


List<Apple> redApples = filterApples(inventory, (Apple apple) -> RED.equals(apple.getColor()));


public interface Predicate<T> {
  boolean test(T t);
}

public static <T> List<T> filter(List<T> list, Predicate<T> p) {
  List<T> result = new ArrayList<>();

  for(T e: list) {
    if(p.test(e)) {
      result.add(e);
    }
  }

  return result;
}
```

```java
// java.util.concurrent.Callable
public interface Callable<V> {
  V call();
}

ExecutorService executorService = Executors.newCachedThreadPool();
Future<String> threadName = executorService.submit(new Callable<String>() {
  @Override
  public String call() throws Exception {
    return Thread.currentThread().getName();
  }
});

Future<String> threadName = executorService.submit(() -> Thread.currentThread().getName());
```

```java
int port = 1337;
Runnable r = () -> {
  System.out.println(port);
  port = 80; // must be final or effectively final
}
```

```java
Collections.sort(words, new Comparator<String>() {
  public int compare(String s1, String s2) {
    return Integer.compare(s1.length(), s2.length());
  }
});

Collections.sort(words, (s1, s2) -> Integer.compare(s1.length(), s2.length()));
```

```java
map.merge(key, 1, (count, incr) -> count + incr);

map.merge(key, 1, Integer::sum);
```

```java
class Calculator {
  Map<Double, Double> values = new HashMap<>();

  Double square(Double x) {
    Function<Double, Double> squareFunction = new Function<Double, Double>() {
      @Override
      public Double apply(Double value) {
        return value * value;
      }
    }
    return values.computeIfAbsent(x, squareFunction);
  };
}

class Calculator {
  Map<Double, Double> values = new HashMap<>();

  Double square(Double value) {
    Function<Double, Double> squareFunction = factor -> factor * factor;
    return values.computeIfAbsent(value, squareFunction);
  }
}

// one-liner
Function<Double, Double> squareFunction = factor -> factor * factor;
// multi-liner
Function<Double, Double> squareFunction = factor -> {
  return factor * factor;
};


default V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction)
```

```java
class Inventory {
  List<Supply> supplies = new ArrayList<>();

  long countDifferentKinds() {
    List<String> names = new ArrayList<>();

    for (Supply supply : supplies) {
      if (supply.isUncontaminated()) {
        String name = supply.getName();
        if (!names.contains(name)) {
          names.add(name);
        }
      }
    }
    
    return names.size();
  }
}

class Inventory {
  List<Supply> supplies = new ArrayList<>();

  long countDifferentKinds() {
    return supplies.stream()
                   .filter(supply -> supply.isUncontaminated())
                   .map(supply -> supply.getName())
                   .distinct()
                   .count();
  }
}
```

```java
class Inventory {
  List<Supply> supplies = new ArrayList<>();

  long countDifferentKinds() {
    return supplies.stream()
                   .filter(supply -> !supply.isContaminated())
                   .map(supply -> supply.getName())
                   .distinct()
                   .count();
  }
}

class Inventory {
  List<Supply> supplies = new ArrayList<>();

  long countDifferentKinds() {
    return supplies.stream()
                   .filter(Supply::isUncontaminated)
                   .map(Supply::getName)
                   .distinct()
                   .count();
  }
}
```

```java
class BackupJob {
  Communicator communicator;
  Storage storage;

  void backupToEarth() {
    Optional<Connection> connectionOptional = communicator.getConnectionToEarth();

    if (!connectionOptional.isPresent()) {
      throw new IllegalStateException();
    }

    Connection connection = connectionOptional.get();

    if (!connection.isFree()) {
      throw new IllegalStateException();
    }

    connection.send(storage.getBackup());
  }
}

class BackupJob {
  Communicator communicator;
  Storage storage;

  void backupToEarth() {
    Connection connection = communicator.getConnectionToEarth()
            .filter(Connection::isFree)
            .orElseThrow(IllegalStateException::new);
    connection.send(storage.getBackup());
  }
}
```

```java
inventory.sort((Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());

// java.util.Comparator.comparing
// comparing(Function<? super T,? extends U> keyExtractor)
Comparator<Apple> c = Comparator.comparing(Apple::getWeight);
inventory.sort(c);
inventory.sort(c.reversed())
```

```java
private boolean isValidName(String string) {
  return Character.isUpperCase(string.charAt(0));
}

filter(words, this::isValidName)
```

```java
public class Application {
  private Function<? super Input, ? extends Result> strategy;
  public void setStrategy(Function<? super Input, ? extends Result> strategy) {
    this.strategy = strategy;
  }
  void useStrategy() {
    Result r = strategy.apply(input);
  }
}

Application app = new Application();
application.setStrategy(input -> {...});
```

```java
public class Command {
  private final Runnable doAction;
  private final Runnable undoAction;

  public Command(Runnable doCmd, Runnable undoCmd) {
    this.doAction = doCmd;
    this.undoAction = undoCmd;
  }

  ...
}

public class CmdHandler {
  ...
  public void doCmd(Command cmd) {
    cmd.doAction().run();
    undoStack.addFirst(cmd);
  }

  public void undoCmd() {
    if (undoStack.isEmpty()) return;
    undoStack.pop().undoAction().run();
  }
}

CmdHandler.getInstance().doCmd(
  new Command(
    () -> {}, // Do
    () -> {}  // Undo
  )
);
```