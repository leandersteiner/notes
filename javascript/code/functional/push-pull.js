const s = a => b => a(b);
s(console.log)(1);

const t = s(console.log);
setTimeout(() => t(2), 1000);

s(x => x(3))(console.log);
s(resolve => resolve(4))(console.log);

new Promise(resolve => resolve(5)).then(console.log);

s(resolve => setTimeout(() => resolve(6), 3000))(console.log);
