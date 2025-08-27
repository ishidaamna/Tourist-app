import { useState, useEffect } from "react";
import { getFromLocalStorage, setToLocalStorage } from "../utils/localStorage";

export const useLocalStorageState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getFromLocalStorage(key, defaultValue);
  });

  useEffect(() => {
    setToLocalStorage(key, value);
  }, [key, value]);

  return [value, setValue];
};
