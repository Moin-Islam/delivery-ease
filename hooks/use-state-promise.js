import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const useStatePromise = (initialState = undefined, skipFirst = true) => {
  const [state, setState] = useState(initialState);
  const first = useRef(skipFirst);
  const resolver = useRef(null);

  const setStatePromise = useCallback((value) => {
    setState(value);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (resolver.current) {
      resolver.current(state);
      resolver.current = null;
    }
  }, [state]);

  return [state, setState, setStatePromise];
};

export default useStatePromise;
