interface GreetProps {
  name: string;
}

export const Greet = (props: GreetProps) => <h1>Hello, {props.name}!</h1>;
