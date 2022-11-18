# Basics

main.go

```go
package main

import (
  "fmt"
  "log"
  "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintln(w, "Hello, 世界")
}

func main() {
  http.HandleFunc("/", handler)
  fmt.Println("Running demo app. Press Ctrl+C to exit...")
  log.Fatal(http.ListenAndServe(":8888", nil))
}
```

Dockerfile

```Dockerfile
FROM golang:1.17-alpine AS build

WORKDIR /src/
COPY main.go go.* /src/
RUN CGO_ENABLED=0 go build -o /bin/demo

FROM scratch
COPY --from=build /bin/demo /bin/demo
ENTRYPOINT ["/bin/demo"]
```

Building the image

`docker image build -t myhello .`

Running the image

`docker container run -p 9999:8888 myhello`

Running using kubernetes

`kubectl run demo --image=docker_id/myhello --port=9999 --labels app=demo`

Forwarding ports

`kubectl port-forward pod/demo 9999:8888`

Check status

`kubectl get pods --selector app=demo`