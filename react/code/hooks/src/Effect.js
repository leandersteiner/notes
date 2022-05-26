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
