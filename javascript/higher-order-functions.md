# Higher -order Functions

Hgher-order functions are functions that either receive a function as an argument or return a function.
Returning functions will result in function closure.

## Examples

### Receiving functions as arguments (callback functions)

```js
const higherOrder = (cb) => {
  cb("test");
};

higherOrder(console.log);
```

Output:

```
test
```

### Returning a function from a function

Making use of closure by using partial application to create loggers with different prefixes.

```js
const higherOrder = (prefix) => {
  return (msg) => {
    console.log(prefix, msg); // access to prefix -> closure
  };
};

const infoLog = higherOrder("INFO:");
infoLog("Message to log here");

const errorLog = higherOrder("ERROR:");
errorLog("Message to log here");
```

Output:

```
INFO: Message to log here
ERROR: Message to log here
```
