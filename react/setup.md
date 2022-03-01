# Setup

## React on codepen.io

1. Create a new codepen
2. Select Babel as js preprocessor
3. Add react as a external script
4. Add react-dom as exeternal script

```html
<div id="root"></div>
```

```js
const Greet = (props) => <h1>Hello, {props.name}!</h1>;

ReactDOM.render(<Greet name="Leander" />, document.getElementById('root'));
```

## Local development

### React directly in HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React</title>
    <script src="https://unpkg.com/react@17.0.2/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>
    <script src="index.js" type="text/babel"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```js
const Greet = (props) => <h1>Hello, {props.name}!</h1>;

ReactDOM.render(<Greet name="Leander" />, document.getElementById('root'));
```

We need to run it using a http server for react to work.

```
$ npm install -g http-server
$ http-server .
```

### create-react-app

`npm install -g create-react-app`

`create-react-app project-name`

The command will create a new folder with the name `project-name` as specified when calling the command. We then delete all files inside the `src` folder except the `index.js` file.
After that we create a `Greet.js` file that will contain out Greet component. After that we initialize our Greet component inside the `index.js` file.

index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Greet } from './Greet';

ReactDOM.render(
  <React.StrictMode>
    <Greet name="Leander" />
  </React.StrictMode>,
  document.getElementById('root')
);
```

Greet.js

```js
export const Greet = (props) => <h1>Hello, {props.name}!</h1>;
```

We can now start the development server by running `npm start` which is defined in the `package.json`.
This development server automatically reloads any changes made inside our project folder which is very convenient while developing our application. The development server should never be used in production!

Use `create-react-app project-name --template typescript` to generate a react application based on typescript.
