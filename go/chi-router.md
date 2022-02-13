# Using go-chi

## Installation

```
go get -u github.com/go-chi/chi/v5
```

```go
import (
	"github.com/go-chi/chi/v5"
)
```

## Methods corresponding to HTTP-Methods

```go
Connect(pattern string, h http.HandlerFunc)
Delete(pattern string, h http.HandlerFunc)
Get(pattern string, h http.HandlerFunc)
Head(pattern string, h http.HandlerFunc)
Options(pattern string, h http.HandlerFunc)
Patch(pattern string, h http.HandlerFunc)
Post(pattern string, h http.HandlerFunc)
Put(pattern string, h http.HandlerFunc)
Trace(pattern string, h http.HandlerFunc)
```

## Basic usage

```go
package main

import (
	"github.com/go-chi/chi/v5"
	"net/http"
)

func main() {
	r := chi.NewRouter()
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome"))
	})
	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome POST"))
	})

	http.ListenAndServe(":8080", r)
}
```

Here we create a new `chi.Mux` instance and register two routes providing a pattern and a `http.HandlerFunc` which is executed if a request gets routed to our pattern using the http method in the method name.

## Working with URL parameters

```go
r.Get("/{id}", func(w http.ResponseWriter, r *http.Request) {
		idParam := chi.URLParam(r, "id")
		w.Write([]byte("Welcome " + idParam))
})
```

URL parameters are written inside `{}` within our provided routing pattern. To access them withou our handlers we call `chi.URLParam(*http.Request, string)` with our request instance and the parameter name we provided in our routing pattern. The data is always returned as a string. We can also user regular expressions in our url patterns.

## Sub Routers

When designing Restful APIs we need to provide many different HTTP-Methods for the same resource. Sub routers make api design a lot cleaner.

```go
package main

import (
	"github.com/go-chi/chi/v5"
	"net/http"
)

func placeholderHandler(w http.ResponseWriter, _ *http.Request) {
	w.Write([]byte("Placeholder"))
}

func main() {
	r := chi.NewRouter()
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome"))
	})

	userRouter := chi.NewRouter()
	userRouter.Get("/", placeholderHandler)
	userRouter.Get("/{id}", placeholderHandler)
	userRouter.Post("/", placeholderHandler)
	userRouter.Patch("/{id}", placeholderHandler)
	userRouter.Put("/{id}", placeholderHandler)
	userRouter.Delete("/{id}", placeholderHandler)

	postRouter := chi.NewRouter()
	postRouter.Get("/", placeholderHandler)
	postRouter.Get("/{id}", placeholderHandler)
	postRouter.Post("/", placeholderHandler)
	postRouter.Patch("/{id}", placeholderHandler)
	postRouter.Put("/{id}", placeholderHandler)
	postRouter.Delete("/{id}", placeholderHandler)

	r.Mount("/users", userRouter)
	r.Mount("/posts", userRouter)

	http.ListenAndServe(":8080", r)
}
```

We can create multiple routers and just mount them to our application router providing a common url pattern.

## Custom Middleware

```go
package main

import (
	"fmt"
	"github.com/go-chi/chi/v5"
	"net/http"
	"time"
)

func TimerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		elapsed := time.Since(start)
		fmt.Println(elapsed)
	})
}

func main() {
	r := chi.NewRouter()
	r.Use(TimerMiddleware)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome"))
	})
	http.ListenAndServe(":8080", r)
}

```

Output:

```
7.394µs
5.491µs
4.869µs
```

Middlewares are just functions that take a `http.Handler` instance and return one. We have to call `next.ServeHTTP(http.ResponseWriter, *http.Request)` otherwise our middleware will be the only thing that runs when we get a matching request.
