# React

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