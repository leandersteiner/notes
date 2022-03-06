# Basics of functional programming

## Push and Pull Evaluation

```js
const s = a => b => a(b);
s(console.log)(1);

const t = s(console.log);
setTimeout(() => t(2), 1000);

s(x => x(3))(console.log);
s(resolve => resolve(4))(console.log);

new Promise(resolve => resolve(5)).then(console.log);

s(resolve => setTimeout(() => resolve(6), 3000))(console.log);
```

- `Function`: Pull with single value
- `Array`: Pull with multiple values
- `Promise`: Push with single value
- `Observable`: Push with multiple values

## Mapping function

```js
const s = a => f => b => a(f(b));

s(console.log)(x => x + 2)(1);

s(console.log)(s(x => x + 2)(x => x + 2))(2);

s(resolve => resolve(3))(f => x => f(x + 2))(console.log);

const map = g => f => x => f(g(x));
s(next => next(4))(map(x => x + 2))(console.log);
```
