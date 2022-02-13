# Using streams to send files

```js
import fs from 'fs';
import { createServer } from 'http';

const server = createServer();

server.on('request', (req, res) => {
  fs.createReadStream('test.txt').pip(res);
});

server.listen(8080, '127.0.0.1', () => console.log('Listening...'));
```
