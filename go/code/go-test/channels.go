package main

import (
	"fmt"
	"runtime"
	"time"
)

func waitForResult() {
	ch := make(chan string)

	go func() {
		time.Sleep(time.Second)
		ch <- "data"
		fmt.Println("child : sent signal")
	}()

	d := <-ch
	fmt.Println("parent : received signal:", d)

	time.Sleep(time.Second)
	fmt.Println("--------------------------------------")
}

func fanOut() {
	children := 50
	ch := make(chan string, children)

	for c := 0; c < children; c++ {
		go func(child int) {
			time.Sleep(time.Second)
			ch <- "data"
			fmt.Println("child : send signal :", child)
		}(c)
	}

	for children > 0 {
		d := <-ch
		children--
		fmt.Println(d)
		fmt.Println("parent : received signal :", children)
	}
}

func pooling() {
	ch := make(chan string)

	g := runtime.GOMAXPROCS(0)
	for c := 0; c < g; c++ {
		go func(child int) {
			for d := range ch {
				fmt.Printf("child %d : received signal : %s\n", child, d)
			}
			fmt.Printf("child %d : received shutdown signal\n", child)
		}(c)
	}

	const work = 50
	for w := 0; w < work; w++ {
		ch <- "data"
		fmt.Println("parent : sent signal :", w)
	}

	close(ch)
	fmt.Println("parent : sent shutdown signal")

	time.Sleep(time.Second)
	fmt.Println("--------------------------------------")
}

func main() {
	//waitForResult()
	//fanOut()
	pooling()
}
