---
id: backpressure
aliases: 
tags:
---

# Backpressure

```go
package main

import (
 "errors"
 "net/http"
 "time"
)

func main() {
 pg := New(10)
 http.HandleFunc("/request", func(w http.ResponseWriter, r *http.Request) {
  err := pg.Process(func() {
   w.Write([]byte(doThingsThatShouldBeLimited()))
  })
  if err != nil {
   w.WriteHeader(http.StatusTooManyRequests)
   w.Write([]byte("Too many request"))
  }
 })
 http.ListenAndServe(":8080", nil)
}

func doThingsThatShouldBeLimited() string {
 time.Sleep(2 * time.Second)
 return "done"
}

type PressureGauge struct {
 ch chan struct{}
}

func New(limit int) *PressureGauge {
 ch := make(chan struct{}, limit)
 for i := 0; i < limit; i++ {
  ch <- struct{}{}
 }
 return &PressureGauge{
  ch: ch,
 }
}

func (pg *PressureGauge) Process(f func()) error {
 select {
 case <-pg.ch:
  f()
  pg.ch <- struct{}{}
  return nil
 default:
  return errors.New("no more capacity")
 }
}
```

Using [hey](https://github.com/rakyll/hey) we can test the functionality.

```
hey http://localhost:8080/request
```

Output:

```
Summary:
  Total:        8.0090 secs
  Slowest:      2.0032 secs
  Fastest:      0.0001 secs
  Average:      0.4014 secs
  Requests/sec: 24.9719

  Total data:   2720 bytes
  Size/request: 13 bytes

Response time histogram:
  0.000 [1]     |
  0.200 [159]   |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.401 [0]     |
  0.601 [0]     |
  0.801 [0]     |
  1.002 [0]     |
  1.202 [0]     |
  1.402 [0]     |
  1.603 [0]     |
  1.803 [0]     |
  2.003 [40]    |■■■■■■■■■■


Latency distribution:
  10% in 0.0002 secs
  25% in 0.0003 secs
  50% in 0.0019 secs
  75% in 0.0030 secs
  90% in 2.0018 secs
  95% in 2.0024 secs
  99% in 2.0031 secs

Details (average, fastest, slowest):
  DNS+dialup:   0.0003 secs, 0.0001 secs, 2.0032 secs
  DNS-lookup:   0.0003 secs, 0.0000 secs, 0.0030 secs
  req write:    0.0001 secs, 0.0000 secs, 0.0018 secs
  resp wait:    0.4005 secs, 0.0001 secs, 2.0025 secs
  resp read:    0.0003 secs, 0.0000 secs, 0.0026 secs

Status code distribution:
  [200] 40 responses
  [429] 160 responses
```

We can see that only 40 requests got a status code of 200 while 160 were not executed yielding in a status code of 429.
