package main

import "fmt"

func main() {
	var a int
	var b = 5
	c := 10
	const d = 20

	fmt.Println(a, b, c, d)
	//d = 5 -> cannot assign to d (declared const)
}
