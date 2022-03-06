// Callbacks
const longRunningCb = resolve => {
  setTimeout(() => {
    resolve({ data: 1 });
  }, 1000);
};

longRunningCb(result => console.log(result.data));

// Continuation Monad
const longRunningContinue = () => {
  return resolve => {
    setTimeout(() => {
      resolve({ data: 1 });
    }, 1000);
  };
};

longRunningContinue()(result => console.log(result.data));

// Promises
const longRunningPromise = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: 1 });
    }, 1000);
  });
};

longRunningPromise().then(result => console.log(result.data));

// Async/await
(async () => {
  const result = await longRunningPromise();
  console.log(result.data);
})();

// Events
class EventTask {
  getData() {
    setTimeout(() => {
      this.onFinished({ data: 1 });
    }, 1000);
  }
}

const task = new EventTask();
task.onFinished = result => console.log(result.data);
task.getData();

// Observer
class TaskObservable {
  constructor() {
    this.observers = [];
  }
  subscribe(observer) {
    this.observers.push(observer);
  }
  notify(value) {
    this.observers.forEach(observer => observer.next(value));
  }
  getData() {
    setTimeout(() => this.notify({ data: 1 }, 1000));
  }
}

const observable = new TaskObservable();
observable.subscribe({
  next: result => console.log(result.data),
});
observable.getData();
