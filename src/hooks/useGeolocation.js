import { useState, useEffect } from "react";
import { AVAILABLE_PLACES } from "../data";
import { sortPlacesByDistance } from "../loc";

export const useGeolocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availablePlaces, setAvailablePlaces] = useState(AVAILABLE_PLACES);
  const [fallbackText, setFallbackText] = useState("Sorting places by distance...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by this browser"));
      setLoading(false);
      setAvailablePlaces(AVAILABLE_PLACES);
      setFallbackText("Unable to get location. Showing all available places.");
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
      ...options,
    };

    const maxRetries = typeof options.retries === "number" ? options.retries : 2;
    const retryDelayMs = typeof options.retryDelayMs === "number" ? options.retryDelayMs : 1000;

    let attempts = 0;
    let retryTimeoutId = null;
    let isActive = true;

    const handleSuccess = (position) => {
      if (!isActive) return;
      setPosition(position);
      setError(null);
      setLoading(false);
      const sorted = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sorted);
      setFallbackText("Sorting places by distance...");
    };

    const requestPosition = () => {
      if (!isActive) return;
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        defaultOptions
      );
    };

    const scheduleRetry = () => {
      if (!isActive) return;
      if (attempts >= maxRetries) {
        // Exhausted retries; surface error and stop loading
        setLoading(false);
        setAvailablePlaces(AVAILABLE_PLACES);
        setFallbackText("Unable to get location. Showing all available places.");
        return false;
      }
      attempts += 1;
      const delay = retryDelayMs * attempts; // simple backoff
      retryTimeoutId = setTimeout(requestPosition, delay);
      return true;
    };

    const handleError = (geoError) => {
      if (!isActive) return;
      let errorMessage;
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage = "Location access denied by user";
          setError(new Error(errorMessage));
          setLoading(false);
          setAvailablePlaces(AVAILABLE_PLACES);
          setFallbackText("Unable to get location. Showing all available places.");
          return;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable";
          // Temporary on Apple (kCLErrorLocationUnknown). Retry a few times.
          if (scheduleRetry()) return;
          break;
        case geoError.TIMEOUT:
          errorMessage = "Location request timed out";
          // Retry once or twice on timeout as well.
          if (scheduleRetry()) return;
          break;
        default:
          errorMessage = "An unknown error occurred while retrieving location";
          break;
      }
      setError(new Error(errorMessage));
      setLoading(false);
      setAvailablePlaces(AVAILABLE_PLACES);
      setFallbackText("Unable to get location. Showing all available places.");
    };

    requestPosition();

    return () => {
      isActive = false;
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
    };
  }, [options]);

  const getAvailablePlacesFallbackText = () => {
    if (loading) {
      return "Getting your location to sort places by distance...";
    }
    if (error) {
      return "Unable to get location. Showing all available places.";
    }
    return "Sorting places by distance...";
  };

  return { 
    position, 
    error, 
    loading, 
    availablePlaces, 
    fallbackText,
    getAvailablePlacesFallbackText 
  };
};
