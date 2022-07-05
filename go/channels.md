# Channels

## Cancelation

```go
package main

import (
	"context"
	"fmt"
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	duration := 150 * time.Millisecond
	ctx, cancel := context.WithTimeout(context.Background(), duration)
	defer cancel()

	ch := make(chan string, 1)

	go func() {
		time.Sleep(time.Duration(rand.Intn(250)) * time.Millisecond)
		ch <- "data"
	}()

	select {
	case d := <-ch:
		fmt.Println("work completed", d)

	case <-ctx.Done():
		fmt.Println("work cancelled")
	}

	time.Sleep(250 * time.Millisecond)
}
```

Output: (Example it is random)

```
$ go run channel-cancelation.go
work completed data
$ go run channel-cancelation.go
work cancelled
$ go run channel-cancelation.go
work completed data
$ go run channel-cancelation.go
work completed data
```
## Wait for result

```go
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
```

## Fan out/In

```go
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
```


## Pooling

```go
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
```
