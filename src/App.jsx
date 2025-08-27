import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import logoImg from "./assets/logo.png";

import { getFromLocalStorage } from "./utils/localStorage.js";
import { useGeolocation } from "./hooks/useGeolocation.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";

const initializePickedPlaces = () => {
  const storedIds = getFromLocalStorage("selectedPlaces", []);
  return storedIds
    .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
    .filter(Boolean);
};

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(initializePickedPlaces);

  const [pickedPlaceIds, setPickedPlaceIds] = useLocalStorageState(
    "selectedPlaces",
    []
  );

  const {
    availablePlaces,
    getAvailablePlacesFallbackText,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000,
  });

  useEffect(() => {
    const places = pickedPlaceIds
      .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
      .filter(Boolean);
    setPickedPlaces(places);
  }, [pickedPlaceIds]);

  const handleStartRemovePlace = (id) => {
    selectedPlace.current = id;
    setModalIsOpen(true);
  };

  const handleStopRemovePlace = () => {
    setModalIsOpen(false);
  };

  const handleSelectPlace = (id) => {
    if (pickedPlaceIds.includes(id)) {
      return;
    }
    setPickedPlaceIds((prevIds) => [id, ...prevIds]);
  };

  const handleRemovePlace = () => {
    const idToRemove = selectedPlace.current;
    setPickedPlaceIds((prevIds) => prevIds.filter((id) => id !== idToRemove));
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
