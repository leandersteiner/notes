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
