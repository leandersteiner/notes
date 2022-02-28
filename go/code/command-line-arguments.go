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
