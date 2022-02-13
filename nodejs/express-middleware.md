# Express middleware

Middlewares in express are simple functions with this signature: `function(req, res, next)`.
Let's create a simple middleware that logs the amount of secons a request took to finish.

```js
import express from 'express';

const app = express();

// Our middleware
app.use((req, res, next) => {
  const before = new Date().getTime();
  next();
  const after = new Date().getTime();
  console.log((after - before) / 1000);
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome');
});

app.listen(8080, '127.0.0.1', () => console.log('Listening...'));
```
