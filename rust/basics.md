# Rust basics

Rust is a modern programming language that is ***blazingly fast***.

## Memory

Rust can guarantee at compile time that there will be no runtime errors in regard to memory management.
This is why Rust does not need a garbage collector.
Every value has an owner and a value lives as long as it's owner.
The owner can change and for access, references can be borrowed.
Borrowed references are usually read only but there can also be a read/write reference.

## OOP

Rust, like Go does not support inheritance.
It does however allow for good encapsulation of data through modules.
Data can have mathods and polymorphism is supported through traits.

## Parallelism

Rust like Go allows for messaging between Threads through channels.
It also offers all primitives like Mutexes we are accustomed to.
The concept of ownership allows us to see problematic code early on.
It also looks like Rust allows for different Thread-Modules to be used.

## Installation

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Examples

### Hello World

```rust
fn main() {
    println!("Hello World");
}
```

```
rustc hello-world.rs
./hello-world
```

### A first example

```rust
use std::fs::File;
use std::io::{BufReader, BufRead};

fn main() {
  let file = File::open("hello.txt").expect("Couldn't open file");
  let reader = BufReader::new(file);

  for line in reader.lines() {
    let line = line.expect("Couldn't read line");
    println!("{}", line);
  }
}
```

## Rust build system

Rust comes with an excellent build system called Cargo.
There is no need to ever call the rust compiler ourselves.

### Structure of rust projects

Cargo allows us to create and manage software packages, manage dependencies, run tests and building of libraries or executables (Crates).
One package consists of one or more crates which consist of one or more file.
All of that resides within a workspace, which can contain multiple packages.

```rust
use std::fs::File;
```

We want to use the object File inside the submodule fs inside the module std;

### Creating a package

```
cargo new hello-world
```

Will create:

```
hello-world/
  Cargo.toml
  src/
    main.rs
```

To init in an already existing directory:

```
cargo init
```

This will only create the `Cargo.toml` file inside the current directory.

### Building and running a Package

```
cargo build
```

This will create a new folder `target/debug/hello-world` which contains our executable `hello-world`.
Cargo supports different build configurations like `dev`, `release`, `test` and `bench`, which will create their own build directories. We can also create custom build configurations.

```
cargo build --release
```

Will switch from `dev` to the `release` build config.
We can also just confirm that our code will compile by running `cargo check`.

```
cargo run
```

Will run our program here we can also use different build configurations.

```
cargo install --path <path to project directory>
cargo install --path .
```

This will install our program locally so we can use it on our system.
It installs our program inside the directory where all rust tools are located.

```
cargo uninstall hello-world
```

```
cargo clean
```

### Managing dependencies

The standard library shipped with Rust only contains essential packages to add other crates as dependencies we also use cargo.
To search for crates head to `https://crates.io`.

```
cargo search hex
```

Any external crate will be added to our `Cargo.toml`.

Cargo.toml
```toml
[package]
name = "dependencies"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
hex = "0.4"
```

If we leave the version quotation marks empty or use the `*` the latest version will be used.
Cargo will download new dependencies on build and save them locally (`.cargo/registry`).

```
➜  dependencies git:(main) ✗ cargo build
    Updating crates.io index
  Downloaded hex v0.4.3
  Downloaded 1 crate (13.3 KB) in 0.38s
   Compiling hex v0.4.3
   Compiling dependencies v0.1.0 (/home/ls/repos/github.com/notes/rust/code/basics/dependencies)
    Finished dev [unoptimized + debuginfo] target(s) in 40.36s
```

We can also use other repositories or local directories as sources for crates:

```
example_lib = { git = https://github.com/leandersteiner/example_lib }
example_lib = { path = "../example_lib" }
```

The command `cargo tree` lists all direct and indirect dependencies our project depends on in an hierarchical structure.

```
➜  dependencies git:(main) ✗ cargo tree
dependencies v0.1.0 (/home/ls/repos/github.com/notes/rust/code/basics/dependencies)
└── hex v0.4.3
```

Once we downloaded the dependencies cargo creates a new file `Cargo.lock` where all our dependencies and their actual used versions are listed. Cargo maintains this file for us we should never edit it manually.

To updated dependencies the following command is used:

```
cargo update -p hex
```

Without the `-p hex` all dependencies would be updated not just a specific one.

### Workspaces

Whenever our project is too big to fit into a single package we can use workspaces to better manage our project. A workspace can contain multiple packages which are built together.
Inside the workspace there is a single `Cargo.toml` which contains the workspace definition and shared configuration options and any amount of packages. Packages inside the workspace are created the usual way with `cargo new`.

A workspace with two packages `package1` and `package2` would look like this:

```
workspace/
  Cargo.toml
  package1/
  package2/
```

The `Cargo.toml` needs to be created by hand.

```toml
[workspace]
memebers = [
  "package1",
  "package2"
]
```
