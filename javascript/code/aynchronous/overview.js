const longRunning = () => {
  let n = 3000000000;
  while (n > 0) n--;
  return { data: 1 };
};

const otherTask = () => {
  console.log('Starting next Task');
};

let result = longRunning();
console.log(result.data);

otherTask();

setImmediate(() => {
  let result2 = longRunning();
  console.log(result2.data);
});

otherTask();
