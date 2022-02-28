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
