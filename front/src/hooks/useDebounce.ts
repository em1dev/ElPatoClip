import { useEffect, useState } from "react";

export const useDebouce = <T>(value: T, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay)

    return () => {
      clearTimeout(timeoutId);
    }
  }, [value, delay]);

  return debouncedValue;
};