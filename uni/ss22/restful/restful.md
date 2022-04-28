# RESTful Web Services

## Specification

- OpenAPI/Swagger

## Resource representation

### URLs

- URL identifies resources
- URLs are easy to parse
- parsing functionality usually provided by a framework
- access to different services is uniform

#### GET

- `GET /products/{productId}`
- `GET /products?free-query={freeQuery}`

#### POST

- `POST /products`

#### PUT

- `PUT /products/{productId}`

#### DELETE

- `DELETE /products/{productId}`

## HTTP response status codes

### 100: infromation

- 100 (Continue)
- 102 (Processing)

### 200: success

- 200 (Ok)
- 201 (Created)

### 300: redirect

- 300 (Multiple Choices)
- 301 (Moved Permanently)
- 307 (Temporary)
- 308 (Permanent)


### 400: client error

- 400 (Bad Request)
- 401 (Unauthorized)
- 403 (Forbidden)
- 404 (Not Found)
- 405 (Not Allowed)
- 406 (Not Acceptable)
- 409 (Conflict)
- 410 (Gone)
- 412 (Precondition Failed)
- 413 (Request Entity Too Large)
- 415 (Unsupported Media Type)

### 500: server error

- 500 (Internal Server Error)
- 503 (Service Unavailable)

## HTTP Header

- Content-Type
- Content-Length
- Content-Language
- Content-MD5
- Content-Encoding
- Last-Modified