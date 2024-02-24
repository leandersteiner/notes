# Services

## [Mat Ryer](https://grafana.com/blog/2024/02/09/how-i-write-http-services-in-go-after-13-years/)

> My handlers used to be methods hanging off a server struct, but I no longer do this. If a handler function wants a dependency, it can bloody well ask for it as an argument. No more surprise dependencies when you’re just trying to test a single handler.

- NewServer is a big constructor that takes in all dependencies as arguments
- It returns an http.Handler if possible, which can be a dedicated type for more complex situations
- It usually configures its own muxer and calls out to routes.go

```go
func NewServer(
	logger *Logger
	config *Config
	commentStore *commentStore
	anotherStore *anotherStore
) http.Handler {
	mux := http.NewServeMux()
	addRoutes(
		mux,
		Logger,
		Config,
		commentStore,
		anotherStore,
	)
	var handler http.Handler = mux
	handler = someMiddleware(handler)
	handler = someMiddleware2(handler)
	handler = someMiddleware3(handler)
	return handler
}
```

```go
srv := NewServer(
	logger,
	config,
	tenantsStore,
	slackLinkStore,
	msteamsLinkStore,
	proxy,
)
httpServer := &http.Server{
	Addr:    net.JoinHostPort(config.Host, config.Port),
	Handler: srv,
}
go func() {
	log.Printf("listening on %s\n", httpServer.Addr)
	if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		fmt.Fprintf(os.Stderr, "error listening and serving: %s\n", err)
	}
}()
var wg sync.WaitGroup
wg.Add(1)
go func() {
	defer wg.Done()
	<-ctx.Done()
	// make a new context for the Shutdown (thanks Alessandro Rosetti)
	shutdownCtx := context.Background()
	shutdownCtx, cancel := context.WithTimeout(ctx, 10 * time.Second)
	defer cancel()
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		fmt.Fprintf(os.Stderr, "error shutting down http server: %s\n", err)
	}
}()
wg.Wait()
return nil
```

- Map the entire API surface in routes.go

> Sometimes you can’t help but have things spread around a bit, but it’s very helpful to be able to go to one file in every project to see its API surface.

```go
func addRoutes(
	mux                 *http.ServeMux,
	logger              *logging.Logger,
	config              Config,
	tenantsStore        *TenantsStore,
	commentsStore       *CommentsStore,
	conversationService *ConversationService,
	chatGPTService      *ChatGPTService,
	authProxy           *authProxy
) {
	mux.Handle("/api/v1/", handleTenantsGet(logger, tenantsStore))
	mux.Handle("/oauth2/", handleOAuth2Proxy(logger, authProxy))
	mux.HandleFunc("/healthz", handleHealthzPlease(logger))
	mux.Handle("/", http.NotFoundHandler())
}
```

> addRoutes doesn’t return an error. Anything that can throw an error is moved to the run function and sorted out before it gets to this point leaving this function free to remain simple and flat

- func main() only calls run()

```go
func run(ctx context.Context, w io.Writer, args []string) error {
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	// ...
}

func main() {
	ctx := context.Background()
	if err := run(ctx, os.Stdout, os.Args); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
}
```

>  I used to do the signal.NotifyContext bit in main but Dave Henderson (and a couple of others) pointed out that cancel wouldn’t get called, so I’ve moved it into the run function.

> I often end up with run function signatures that look like this:

```go
func run(
	ctx    context.Context,
	args   []string,
	getenv func(string) string,
	stdin  io.Reader,
	stdout, stderr io.Writer,
) error
```

```go
args := []string{
	"myapp",
	"--out", outFile,
	"--fmt", "markdown",
}
go run(ctx, args, etc.)

getenv := func(key string) string {
	switch key {
	case "MYAPP_FORMAT":
		return "markdown"
	case "MYAPP_TIMEOUT":
		return "5s"
	default:
		return ""
}
go run(ctx, args, getenv)
```

> If your program uses environment variables over flags (or even both) then the getenv function allows you to plug in different values without changing the actual environment.
> In the main function, we can pass in the real things:

```go
func main() {
	ctx := context.Background()
	if err := run(ctx, os.Getenv, os.Stderr); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
		os.Exit(1)
	}
}
```

### Maker funcs return the handler
> My handler functions don’t implement http.Handler or http.HandlerFunc directly, they return them. Specifically, they return http.Handler types.

```go
// handleSomething handles one of those web requests
// that you hear so much about.
func handleSomething(logger *Logger) http.Handler {
	thing := prepareThing()
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			// use thing to handle request
			logger.Info(r.Context(), "msg", "handleSomething")
		}
	)
}
```

### Handle decoding/encoding in one place

```go
func encode[T any](w http.ResponseWriter, r *http.Request, status int, v T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("encode json: %w", err)
	}
	return nil
}

func decode[T any](r *http.Request) (T, error) {
	var v T
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return v, fmt.Errorf("decode json: %w", err)
	}
	return v, nil
}

err := encode(w, r, http.StatusOK, obj)

decoded, err := decode[CreateSomethingRequest](r)
```

### Validating data

```go
// Validator is an object that can be validated.
type Validator interface {
	// Valid checks the object and returns any
	// problems. If len(problems) == 0 then
	// the object is valid.
	Valid(ctx context.Context) (problems map[string]string)
}

func decodeValid[T Validator](r *http.Request) (T, map[string]string, error) {
	var v T
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return v, nil, fmt.Errorf("decode json: %w", err)
	}
	if problems := v.Valid(r.Context()); len(problems) > 0 {
		return v, problems, fmt.Errorf("invalid %T: %d problems", v, len(problems))
	}
	return v, nil, nil
}
```

> The method can do whatever it needs to validate the fields of the struct. For example, it can check to make sure:

- Required fields are not empty
- Strings with a specific format (like email) are correct
- Numbers are within an acceptable range

> If you need to do anything more complicated, like check the field in a database, that should happen elsewhere

### The adapter pattern for middleware

```go
func adminOnly(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !currentUser(r).IsAdmin {
			http.NotFound(w, r)
			return
		}
		h(w, r)
	})
}

package app

func addRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/", handleAPI())
	mux.HandleFunc("/about", handleAbout())
	mux.HandleFunc("/", handleIndex())
	mux.HandleFunc("/admin", adminOnly(handleAdminIndex()))
}
```

### Sometimes I return the middleware

```go
mux.Handle("/route1", middleware(logger, db, slackClient, rroll []byte, handleSomething(handlerSpecificDeps))
mux.Handle("/route2", middleware(logger, db, slackClient, rroll []byte, handleSomething2(handlerSpecificDeps))
mux.Handle("/route3", middleware(logger, db, slackClient, rroll []byte, handleSomething3(handlerSpecificDeps))
mux.Handle("/route4", middleware(logger, db, slackClient, rroll []byte, handleSomething4(handlerSpecificDeps))

func newMiddleware(
	logger Logger,
	db *DB,
	slackClient *slack.Client,
	rroll []byte,
) func(h http.Handler) http.Handler

middleware := newMiddleware(logger, db, slackClient, rroll)
mux.Handle("/route1", middleware(handleSomething(handlerSpecificDeps))
mux.Handle("/route2", middleware(handleSomething2(handlerSpecificDeps))
mux.Handle("/route3", middleware(handleSomething3(handlerSpecificDeps))
mux.Handle("/route4", middleware(handleSomething4(handlerSpecificDeps))

// middleware is a function that wraps http.Handlers
// proving functionality before and after execution
// of the h handler.
type middleware func(h http.Handler) http.Handler
```

### An opportunity to hide the request/response types away

If an endpoint has its own request and response types, usually they’re only useful for that particular handler.
If that’s the case, you can define them inside the function.

```go
func handleSomething() http.HandlerFunc {
	type request struct {
		Name string
	}
	type response struct {
		Greeting string `json:"greeting"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		...
	}
}
```

### sync.Once to defer setup

If I have to do anything expensive when preparing the handler, I defer it until that handler is first called.

```go
func handleTemplate(files string...) http.HandlerFunc {
	var (
		init    sync.Once
		tpl     *template.Template
		tplerr  error
	)
	return func(w http.ResponseWriter, r *http.Request) {
		init.Do(func(){
			tpl, tplerr = template.ParseFiles(files...)
		})
		if tplerr != nil {
			http.Error(w, tplerr.Error(), http.StatusInternalServerError)
			return
		}
		// use tpl
	}
}
```

> Remember that by doing this, you are moving the initialization time from startup to runtime (when the endpoint is first accessed). I use Google App Engine a lot, so this makes sense for me, but your case might be different, so it’s worth thinking about where and when to use sync.Once in this way.

---

[Learning cloud native Go](https://github.com/learning-cloud-native-go/myapp?tab=readme-ov-file)

```
myapp
├── cmd
│  ├── api
│  │  └── main.go
│  └── migrate
│     └── main.go
│
├── api
│  ├── resource
│  │  ├── book
│  │  │  ├── handler.go
│  │  │  ├── model.go
│  │  │  ├── repository.go
│  │  │  └── repository_test.go
│  │  ├── common
│  │  │  └── err
│  │  │     └── err.go
│  │  └── health
│  │     └── handler.go
│  │
│  └── router
│     ├── middleware
│     │  ├── request_id.go
│     │  ├── request_id_test.go
│     │  ├── requestlog
│     │  │  ├── handler.go
│     │  │  └── log_entry.go
│     │  ├── content_type.go
│     │  └── content_type_test.go
│     └── router.go
│
├── migrations
│  └── 00001_create_books_table.sql
│
├── config
│  └── config.go
│
├── util
│  ├── logger
│  │  └── logger.go
│  └── validator
│     └── validator.go
│
├── .env
│
├── go.mod
├── go.sum
│
├── docker-compose.yml
├── Dockerfile
│
├── prod.Dockerfile
└── k8s
   ├── app-configmap.yaml
   ├── app-secret.yaml
   ├── app-deployment.yaml
   └── app-service.yaml
``` 

[Structuring a production grade rest api in Go](https://itnext.io/structuring-a-production-grade-rest-api-in-golang-c0229b3feedc)

```go
package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
	"github.com/tonyalaribe/todoapi/basestructure/features/todo"
)

func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Use(
		render.SetContentType(render.ContentTypeJSON), // Set content-Type headers as application/json
		middleware.Logger,                             // Log API request calls
		middleware.DefaultCompress,                    // Compress results, mostly gzipping assets and json
		middleware.RedirectSlashes,                    // Redirect slashes to no slash URL versions
		middleware.Recoverer,                          // Recover from panics without crashing server
	)

	router.Route("/v1", func(r chi.Router) {
		r.Mount("/api/todo", todo.Routes())
	})

	return router
}

func main() {
	router := Routes()

	walkFunc := func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		log.Printf("%s %s\n", method, route) // Walk and print out all routes
		return nil
	}
	if err := chi.Walk(router, walkFunc); err != nil {
		log.Panicf("Logging err: %s\n", err.Error()) // panic if there is an error
	}

	log.Fatal(http.ListenAndServe(":8080", router)) // Note, the port is usually gotten from the environment.
}
```

```go
package todo

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

type Todo struct {
	Slug  string `json:"slug"`
	Title string `json:"title"`
	Body  string `json:"body"`
}

func Routes() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/{todoID}", GetATodo)
	router.Delete("/{todoID}", DeleteTodo)
	router.Post("/", CreateTodo)
	router.Get("/", GetAllTodos)
	return router
}

func GetATodo(w http.ResponseWriter, r *http.Request) {
	todoID := chi.URLParam(r, "todoID")
	todos := Todo{
		Slug:  todoID,
		Title: "Hello world",
		Body:  "Heloo world from planet earth",
	}
	render.JSON(w, r, todos) // A chi router helper for serializing and returning json
}

func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]string)
	response["message"] = "Deleted TODO successfully"
	render.JSON(w, r, response) // Return some demo response
}

func CreateTodo(w http.ResponseWriter, r *http.Request) {
	response := make(map[string]string)
	response["message"] = "Created TODO successfully"
	render.JSON(w, r, response) // Return some demo response
}

func GetAllTodos(w http.ResponseWriter, r *http.Request) {
	todos := []Todo{
		{
			Slug:  "slug",
			Title: "Hello world",
			Body:  "Heloo world from planet earth",
		},
	}
	render.JSON(w, r, todos) // A chi router helper for serializing and returning json
}
```