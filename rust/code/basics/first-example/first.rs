use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() {
    let file = File::open("hello.txt").expect("Couldn't open file");
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("Couldn't read line");
        println!("{}", line);
    }
}
