# Function Closure

If a function returns a function the returned function still has access to variables that were originally available in the outer functions scope.

## Examples

```js
const outer = counter => {
  const inner = () => {
    console.log(counter);
    counter++;
  };

  return inner;
};

countFromZero = outer(0);
countFromTen = outer(10);

countFromZero();
countFromZero();
countFromZero();

countFromTen();
countFromTen();
countFromTen();
```

Output:

```
0
1
2
10
11
12
```

### Once utility function

```js
const once = cb => {
  let called = false;
  return () => {
    if (called) {
      console.log('Function can only be executed once');
    } else {
      cb();
      called = true;
    }
  };
};

const test = () => console.log('Test');

const testOnce = once(test);
testOnce();
testOnce();
```

Output:

```
Test
Function can only be executed once
```
