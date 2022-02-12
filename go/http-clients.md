---
title: HTTP Clients in Go
date: 2022-02-12T21:00:21.934+01:00
category: go
tags: 
- http
- go
- net/http
---

# net/http - Clients

The `net/http` package offers simple but powerful abstractions around http tasks.

## Clients

### Creating a Client

Instead of using the default client with `http.Get()` we create our own so we can specify our timeout.

```go
client := http.Client { 
  Timeout: 5 * time.Second 
}
```

### Creating a GET Request

We create a new `*http.Request` a pointer to a request object which we will pass to our client for execution. The context we pass is an empty context that has no timeout. We also specify the http method as `http.MethodGet`.

```go
const url = "https://jsonplaceholder.typicode.com/todos/1" 
req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, url, nil) 
if err != nil { 
  panic(err) 
}
```

### Creating a POST Request

We create a new `*http.Request` a pointer to a request object which we will pass to our client for execution. The context we pass is an empty context that has no timeout. We also specify the http method as `http.MethodPost` and pass our request body as the last argument(`io.Reader`).

```go
jsonStr := []byte(`{"username":"newuser", "password":"password"}`) 
const url = "http://our-backend.com/api/v1/users" 
req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, url, bytes.NewBuffer(jsonStr)) 
req.Header.Set("Content-Type", "application/json") 
if err != nil { 
  panic(err) 
}
```

### Executing the Request

Now we can execute the request using our client. We have to make sure that we defer the closing of the responses body which is a `io.ReadCloser`.

```go
res, err := client.Do(req) 
if err != nil { 
  panic(err) 
} 
defer res.Body.Close()

if res.StatusCode != http.StatusOK { 
  panic("unexpected status") 
} 
```

We now have access to a couple of fields on the response object(`*http.Response`)

* `res.StatusCode` -&gt; numeric response status
* `res.Status` -&gt; textual response status
* `res.Header` -&gt; response headers (`type Header map[string][]string`)
* `res.Body` -&gt; the `io.ReadCloser` to read the response data from

### Reading the Response Data

We can now create a new struct that will hold the response data. To achieve this we will first create a new anonymous struct that corresponds to the json we receive back as the response.

```go
var data struct {
	UserID    int    `json:"userId"`
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}
```

Now all we have to do is fill the struct with the response data.

```go
err = json.NewDecoder(res.Body).Decode(&data) 
if err != nil { 
  panic(err) 
}

fmt.Printf("%+v\n", data)
```

Output:

```
{UserID:1 ID:1 Title:delectus aut autem Completed:false}
```

### Full code listing

```go

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func main() {
	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	const url = "https://jsonplaceholder.typicode.com/todos/1"
	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, url, nil)
	if err != nil {
		panic(err)
	}

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		panic("unexpected status")
	}

	var data struct {
		UserID    int    `json:"userId"`
		ID        int    `json:"id"`
		Title     string `json:"title"`
		Completed bool   `json:"completed"`
	}

	err = json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		panic(err)
	}

	fmt.Printf("%+v\n", data)
}
```