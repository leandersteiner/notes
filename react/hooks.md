# React Hooks

## `useState`

Store local state inside of functional components

```js
import { useState } from 'react';

export const State = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };

  const decrement = () => {
    setCounter(counter - 1 < 0 ? 0 : counter - 1);
  };

  return (
    <>
      <div>{counter}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
};
```

Calling `useState()` returns an array with the first value being a variable and the second being a function that is used to change the value of the variable.
The argument to `useState()` will be the inital value for the variable.

### [Should I use one or many state variables?](https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)

Both putting all state in a single useState call, and having a useState call per each field can work. Components tend to be most readable when you find a balance between these two extremes, and group related state into a few independent state variables. If the state logic becomes complex, we recommend managing it with a reducer or a custom Hook.


## `useEffect`

Integrate side effects into the lifecycle of components

```js
import { useEffect, useState } from 'react';

export const Effect = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter => counter + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>{counter}</div>
    </>
  );
};
```

The `useEffect` hook is often used to load state by sending an http request to another service and setting the inner state to the received data.

## `useContext`

Access reacts context API 

## `useReducer`

Flux architecture state management

## `useCallback`

Use memoized callback function

## `useMemo`

Use memoized value

## `useRef`

Manage refrence to JSX/HTML elements

## `useImperativeHandle`

Customizes the instance value that is exposed to parent components when using ref

## `useLayoutEffect`

Read layout from the DOM and synchronously re-render