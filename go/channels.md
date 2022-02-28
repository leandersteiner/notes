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
