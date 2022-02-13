# Node Server in combination with RxJS

```js
import { createServer } from 'http';
import { fromEvent } from 'rxjs';

const server = createServer();
const requests$ = fromEvent(server, 'request').subscribe(([req, res]) => {
  console.log(req.url);
  res.end('Welcome');
});
```

Every request calls `.next()` on the observable.
We use array destructuring to get acces to the request and response objects.
