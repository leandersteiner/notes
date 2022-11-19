import { createServer } from 'http';

createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/html' });
  const responseBody = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <h1>Welcome to this test site</h1>
    </body>
  </html>
  `;
  response.end(responseBody);
}).listen(8080, () => {
  console.log('server running at http://localhost:8080');
});
