import { useState, useEffect } from "react";
import { sortPlacesByDistance } from "../loc";
import { AVAILABLE_PLACES } from "../data";

export const useGeolocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState(AVAILABLE_PLACES); 

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by this browser"));
      setLoading(false);
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
      ...options,
    };

    const handleSuccess = (pos) => {
      setPosition(pos);
      setError(null);
      setLoading(false);

      
      const sorted = sortPlacesByDistance(
        AVAILABLE_PLACES,
        pos.coords.latitude,
        pos.coords.longitude
      );
      setPlaces(sorted);
    };

    const handleError = (err) => {
      setError(err);
      setLoading(false);
      setPlaces(AVAILABLE_PLACES);
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );
  }, []);

  return { position, error, loading, places };
};
