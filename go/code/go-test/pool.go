package main

import (
	"fmt"
	"runtime"
	"time"
)

type job func(chan result)

type result struct {
	name string
	err  error
}

func startWorker(jobs chan job, results chan result, worker int) {
	go func() {
		for j := range jobs {
			fmt.Println("worker", worker, ":doing work")
			j(results)
		}
	}()
}

func main() {
	jobs := make(chan job)
	results := make(chan result)

	go func() {
		for r := range results {
			fmt.Println(r)
		}
	}()

	numWorkers := runtime.NumCPU()
	for i := 0; i < numWorkers; i++ {
		fmt.Println("starting worker", i)
		startWorker(jobs, results, i)
	}

	job1 := func(resCh chan result) {
		r := result{name: "Leander", err: nil}
		resCh <- r
	}

	job2 := func(resCh chan result) {
		r := result{name: "Niels", err: nil}
		resCh <- r
	}

	for {
		jobs <- job1
		jobs <- job2
		time.Sleep(time.Second)
	}
}
