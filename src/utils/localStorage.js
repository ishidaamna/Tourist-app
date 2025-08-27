export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage is not available");
      return defaultValue;
    }

    const item = localStorage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(item);
    } catch (parseError) {
      console.warn(`Failed to parse localStorage item "${key}":`, parseError);
      return item;
    }
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setToLocalStorage = (key, value) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage is not available");
      return false;
    }

    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    if (error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded");
    }
    return false;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage is not available");
      return false;
    }

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};
