const s = a => f => b => a(f(b));

s(console.log)(x => x + 2)(1);

s(console.log)(s(x => x + 2)(x => x + 2))(2);

s(resolve => resolve(3))(f => x => f(x + 2))(console.log);

const map = g => f => x => f(g(x));
s(next => next(4))(map(x => x + 2))(console.log);
