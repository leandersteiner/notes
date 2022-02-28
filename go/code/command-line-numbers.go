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
