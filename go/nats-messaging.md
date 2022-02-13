# Nats messaging using Go

## Publisher

```go
package main

import (
  "github.com/nats-io/nats.go"
  "log"
  "strconv"
)

func main() {
  nc, err := nats.Connect(nats.DefaultURL)
  if err != nil {
    log.Fatal(err)
  }
  defer nc.Close()

  for i := 1; i <= 5; i++ {
    nc.Publish("updates", []byte("Message #" + strconv.Itoa(i)))
  }
}
```

## Subscriber

```go
package main

import (
  "fmt"
  "github.com/nats-io/nats.go"
  "log"
)

func main() {
  nc, err := nats.Connect(nats.DefaultURL)
  if err != nil {
    log.Fatal(err)
  }
  defer nc.Close()

  nc.Subscribe("updates", func (m *nast.Msg)) {
    fmt.Printf("%s\n", m.Data)
  })

  wait := make(chan interface{})
  <-wait
}
```

Output:

```
Message #1
Message #2
Message #3
Message #4
Message #5
```
