# Graceful shutdown of a go server

```go
package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	log "github.com/sirupsen/logrus"
)

func main() {
	mux := chi.NewMux()
	mux.HandleFunc("/", func(rw http.ResponseWriter, req *http.Request) {
		rw.Write([]byte("Hello"))
	})

	srv := http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
	})

	shutdown := make(chan error, 1)

	ctx, stop := signal.NotifyContext(context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
		syscall.SIGQUIT,
		syscall.SIGINT)

	go func() {
		<-ctx.Done()

		log.Info("Shutdown signal received")

		ctxTimeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		defer func() {
			stop()
			cancel()
			close(shutdown)
		}()

		srv.SetKeepAlivesEnabled(false)

		if err := srv.Shutdown(ctxTimeout); err != nil {
			shutdown <- err
		}

		log.Info("Shutdown completed")
	}()

	go func() {
		log.Info("Listening and serving")

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			shutdown <- err
		}
	}()

	if err := <-shutdown; err != nil {
		log.Error("error", err)
	}
	log.Info("exiting...")
}
```
