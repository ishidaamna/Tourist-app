import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";

import { useGeolocation } from "./hooks/useGeolocation.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";
import { AVAILABLE_PLACES } from "./data.js";

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [pickedPlaceIds, setPickedPlaceIds] = useLocalStorageState(
    "selectedPlaces",
    []
  );

  const [pickedPlaces, setPickedPlaces] = useState([]);

  useEffect(() => {
    const places = pickedPlaceIds
      .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
      .filter(Boolean);
    setPickedPlaces(places);
  }, [pickedPlaceIds]);

  const {
    error: geoError,
    loading: geoLoading,
    places: availablePlaces,
  } = useGeolocation();

  const getAvailablePlacesFallbackText = () => {
    if (geoLoading)
      return "Getting your location to sort places by distance...";
    if (geoError)
      return "Unable to get location. Showing all available places.";
    return "Sorting places by distance...";
  };

  const handleStartRemovePlace = (id) => {
    selectedPlace.current = id;
    setModalIsOpen(true);
  };

  const handleStopRemovePlace = () => setModalIsOpen(false);

  const handleSelectPlace = (id) => {
    if (!pickedPlaceIds.includes(id)) {
      setPickedPlaceIds((prev) => [id, ...prev]);
    }
  };

  const handleRemovePlace = () => {
    const idToRemove = selectedPlace.current;
    setPickedPlaceIds((prev) => prev.filter((id) => id !== idToRemove));
    setModalIsOpen(false);
  };

  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>

      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={getAvailablePlacesFallbackText()}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
