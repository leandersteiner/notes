fn main() {
    let a = 1;
    println!("a = {}", a);
    let a = 2;
    println!("a = {}", a);

    let a = 1;
    let a = 2.5; // No Error

    let b = 1;
    b = 2.5; // Error
}
