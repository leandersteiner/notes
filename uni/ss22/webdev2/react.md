# React

React is a framework for developing web frontends.
It only provides functionality corresponding to the view layer in three layer architecture.
The building blocks for a website inside of react are components, which represent one element on a website.
React offers class components through inheritance as well as functional components which are functions returning JSX.
JSX (Javascript XML) is the usual way inside of react projects to write HTML style code directly inside the javascript components.

## [Thinking in React - Steps](https://reactjs.org/docs/thinking-in-react.html)

1. Break The UI Into A Component Hierarchy
2. Build A Static Version in React
3. Identify The Minimal (but complete) Representation Of UI State
4. Identify Where Your State Should Live
5. Add Inverse Data Flow

## First Example

Post.js

```js
export const Post = props => {
  return (
    <div className="post">
      <h2>{props.title}</h2>
      <p>{props.content}</p>
    </div>
  );
};
```

App.js

```js
import { Post } from './components/Post';

const posts = [
  {
    title: 'Title #1',
    content: 'Content #1'
  },
  {
    title: 'Title #2',
    content: 'Content #2'
  },
  {
    title: 'Title #3',
    content: 'Content #3'
  }
];

function App() {
  return (
    <div>
      {posts.map(post => {
        return <Post title={post.title} content={post.content} />;
      })}
    </div>
  );
}

export default App;
```

index.js

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```