# Variables

## Mutability

To declare a variable the `let` keyword is used.

```rust
fn main() {
  let a; // Declaration
  a = 1; // Assignment
  let b = 2; // Declaration & initialization

  println!("a = {}, b = {}", a, b);
}
```

All variables declared with let are immutable.

```rust
fn main() {
  let a = 1;
  println!("a = {}", a);

  a = 2; // Error: cannot assign twice to immutable variable
  println!("a = {}", a);
}
```

If we want to mutate a variable we have to add the `mut` keyword in the declaration.

```rust
fn main() {
  let mut a = 1;
  println!("a = {}", a);

  a = 2;
  println!("a = {}", a);
}
```

## Naming conventions

| Artifact        | Convention           |
| --------------- | -------------------- |
| Crate           | snake_case           |
| Module          | snake_case           |
| Type            | CamelCase            |
| Trait           | CamelCase            |
| Enum            | CamelCase            |
| Function        | snake_case           |
| Method          | snake_case           |
| Variable        | snake_case           |
| Static Variable | SCREAMING_SNAKE_CASE |
| Constant        | SCREAMING_SNAKE_CASE |

## Shadowing

It is possible to create a new variable with the same name as another variable that has been created before. This results in only the new variable being accessible from there on. The previously created variable gets shadowed by the newly defined one.

```rust
fn main() {
  let a = 1;
  println!("a = {}", a);
  let a = 2;
  println!("a = {}", a);
}
```

If we did not specify the `let` keyword again we would have gotten the same error as before since we would try to mutate a immutable variable. If we do not override the variable but shadow it through redefining it we can also change it's type. This would lead to an error if we were to just reassigned it.

```rust
fn main() {
  let a = 1;
  let a = 2.5; // No Error

  let b = 1;
  b = 2.5; // Error
}
```

## Constants

Rust also supports constants through the `const` keyword instead of `let`. The `mut` keyword can not be used with constants. When declaring a constant we need to specify the data type directly.

```rust
const EULER: f32 = 2.718; // global constant

fn main() {
  const PI: f32 = 3.141; // local constant
  println!("PI = {}", PI);
  println!("e = {}", EULER);
}
```
