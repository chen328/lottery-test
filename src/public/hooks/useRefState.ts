import { useState, useRef } from "react";

export default function useRefState<S extends object>(initialState?: S) {
  const ref = useRef(initialState as S);
  const [, setCount] = useState(0);
  const setRafState = (value: Partial<S>) => {
    let data = value || ({} as S);
    Object.assign(ref.current, data);
    setCount((pre) => ++pre % 128);
    return ref.current;
  };

  return [ref.current, setRafState] as const;
}
