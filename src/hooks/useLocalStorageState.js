import { useMemo, useState, useEffect } from "react";
import { getFromLocalStorage, setToLocalStorage } from "../utils/localStorage";
import { AVAILABLE_PLACES } from "../data";

export const useLocalStorageState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getFromLocalStorage(key, defaultValue);
  });

  useEffect(() => {
    setToLocalStorage(key, value);
  }, [key, value]);

  const pickedPlaces = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value
      .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
      .filter(Boolean);
  }, [value]);

  const addId = (id) => {
    setValue((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  };

  const removeId = (id) => {
    setValue((prev) => prev.filter((existingId) => existingId !== id));
  };

  return [value, setValue, { pickedPlaces, addId, removeId }];
};
