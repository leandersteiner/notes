---
id: basics
aliases: []
tags: []
---

# Go - Basics

## Hello World

```go
package main

import "fmt"

func main() {
 fmt.Println("Hello World")
}
```

Output:

```
Hello World
```

## Basic Data Types

- bool
- int8, int16, int32, int64, int
- uint8, uint16, uint32, uint64, uint
- float32, float64
- complex64, complex128
- byte
- rune
- string

Stick to using int/uint until you are certain you need a more specific type like int32.

## Variable declaration and initialization

```go
package main

import "fmt"

func main() {
 var a int // declaration
 var b = 5 // initialization
 c := 10 // short form only possible with initialization
 const d = 20 // constant

 fmt.Println(a, b, c, d)
 //d = 5 -> cannot assign to d (declared const)

 // Grouping variables - Effective Go
 var (
  home   = os.Getenv("HOME")
  user   = os.Getenv("USER")
  gopath = os.Getenv("GOPATH")
 )
}
```

Output:

```
0 5 10 20
```

## Numerical constants with iota

```go
const (
 Nort = iota // 0
 East        // 1 iota can be omitted for the following declarations
 South       // 2
 West        // 3
)

// Example from Effective Go
type ByteSize float64

const (
  _           = iota // ignore first value by assigning to blank identifier
  KB ByteSize = 1 << (10 * iota)
  MB
  GB
  TB
  PB
  EB
  ZB
  YB
)
```

[Effective Go](https://go.dev/doc/effective_go#constants)

## Zero Values

Every uninitialized variable will be set to its types zero value.

- Boolean: false
- Integer: 0
- Float: 0
- Complex: 0i
- String: "" (empty string)
- Ponter: nil

```go
package main

import "fmt"

func main() {
 var b bool
 var i int
 var f float32
 var c complex64
 var s string
 var p *int

 fmt.Printf("b: %T(%v)\n", b, b)
 fmt.Printf("i: %T(%v)\n", i, i)
 fmt.Printf("f: %T(%v)\n", f, f)
 fmt.Printf("c: %T(%v)\n", c, c)
 fmt.Printf("s: %T(%v)\n", s, s)
 fmt.Printf("p: %T(%v)\n", p, p)
}
```

Output:

```
b: bool(false)
i: int(0)
f: float32(0)
c: complex64((0+0i))
s: string()
p: *int(<nil>)
```

## Command Line Arguments

### Providing command line arguments

```go
package main

import (
 "fmt"
 "os"
)

func main() {
 args := os.Args[1:] // Slicing the returned slice starting at index 1
 fmt.Println(os.Args)
 fmt.Println(args)
}

```

Output:

```
[/tmp/go-build3325802214/b001/exe/command-line-arguments test test2 test3]
[test test2 test3]
```

This was run using `go run command-line-arguments.go test test2 test3`.
We can see that go builds the program inside the temp directory when we use `go run`.
If we use `go build` instead the program will be built in the current directory and a binary will be created that we can run.

### Converting command line arguments to numbers

All command line arguments are provided as strings. This is a big limitation since we often need to provide numerical data for example when we need to provide port numbers.
We can use the from c adapted `strconv.Atoi` and `strconv.Itoa` functions to convert between strings and numbers.

- `strconv.Atoi` -> ASCII to int
- `strconv.Itoa` -> int to ASCII

```go
package main

import (
 "fmt"
 "os"
 "strconv"
)

func main() {
 arg1 := os.Args[1]
 arg2 := os.Args[2]

 num1, err := strconv.Atoi(arg1)
 if err != nil {
  panic(err)
 }
 num2, err := strconv.Atoi(arg2)
 if err != nil {
  panic(err)
 }

 fmt.Println(arg1, arg2, num1, num2)
 fmt.Println(num1 + num2)
 fmt.Println(arg1 + arg2)
}
```

Output:

```
$ go run command-line-numbers.go 1 2

1 2 1 2
3
12
```

We can see that if we add the two arg variables together we see `12` as the output. This is because of string concatenation that happens when we add two values of type string.

## Functions

Functions are declared using the `func` keyword followed by the function name with parenthesis containing any parameters. After the parenthesis follow the return types. This is one of the unique features of go, multiple returns from functions.

```go
func findUser(users []user, name string) (user, error) {
 for _, u := range users {
  if u.name == name {
   return u, nil
  }
  return user{}, ErrUserNotFound
 }
}
```

### Variadic Functions

By prefixing a parameter with `...` we can make a parameter variadic. Inside the function it will be available as a slice. It has to be the last argument of the function.

```go
func wrapMiddleware(handler Handler, mw ...Middleware) Handler {
 for i := len(mw) - 1; i >= 0; i-- {
  h := mw[i]
  if h != nil {
   handler = h(handler)
  }
 }
 return handler
}
```

Here we wrap middlewares around a handler.
