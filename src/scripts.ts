import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const driverWrapper = document.querySelector(".js-driver-wrapper");
const driverForm = document.querySelector(".js-driver-form");

type Driver = {
  id: number;
  name: string;
  racesWon: number;
  favTrack: string;
  teamName: string;
  photoURL: string;
  createdAt: Date;
};

// Function for displaying a message to add drivers if there arent any in the db
const displayEmptyDbMessage = () => {
  driverWrapper.innerHTML = `
    <div class="empty-registry-wrapper">
      <h1>
        Hey, the registry is empty.<br>Please add a driver!
      </h1>
    </div>
  `;
};

// Function for displaying the driver info
const displayDriverInfo = (driver: Driver) => {

  // Get the date the driver was created at
  const createdAgo = formatDistanceToNow(new Date(driver.createdAt), {
    addSuffix: true,
  });

  // Create the info inside the driver wrapper
  driverWrapper.innerHTML += `
    <div class="js-driver-item driver-item">
      <div class="photo-wrapper">
        <img src="${driver.photoURL}" class="photoURL" alt="${driver.name}">
      </div>
      <div class="driver-info-wrapper">
        <h2 class="heading-main">Driver Name</h2>
        <h2 class="driverName heading-1">${driver.name}</h2>
        <hr>
        <h2 class="heading-3">Number Of Races Won</h2>
        <h2 class="racesWon heading-2">${driver.racesWon}</h2>
        <hr>
        <h2 class="heading-3">Favorite Track</h2>
        <h2 class="favTrack heading-2">${driver.favTrack}</h2>
        <hr>
        <h2 class="heading-3">Racing Team</h2>
        <h2 class="teamName heading-2">${driver.teamName}</h2>
        <hr>
        <h2 class="heading-3">Joined The Site</h2>
        <h2 class="createdAt heading-2">${createdAgo}</h2>
      </div>
      <div class="button-wrapper">
        <button class="button button-delete js-delete-button" data-driver-id=${driver.id}>Delete</button>
        <button class="button button-edit js-edit-button" data-driver-id=${driver.id}>Edit</button>
      </div>
    </div>
  `;
};


// Delete button
const addDeleteButtonListeners = () => {
  const deleteButton = document.querySelectorAll<HTMLButtonElement>(".js-delete-button");

  // Add a event listener to the buttons
  deleteButton.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      const { driverId } = deleteBtn.dataset;

      // When clicking the delete button delete the driver and redraw the driver info
      axios.delete(`http://localhost:3004/drivers/${driverId}`).then(() => {
        fetchData();
      });
    });
  });
};


// Edit & Save button
const addEditButtonListeners = (data: Driver[]) => {
  const editButton = document.querySelectorAll<HTMLButtonElement>(".js-edit-button");

  // Add a event listener to the buttons
  editButton.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {
      const { driverId } = editBtn.dataset;

      // Get the driver card on which the edit button was pressed
      const driverDiv = editBtn.closest(".js-driver-item");

      // Get the existing info
      const existingDriverName = driverDiv.querySelector(".driverName");
      const existingRacesWon = driverDiv.querySelector(".racesWon");
      const existingFavTrack = driverDiv.querySelector(".favTrack");
      const existingTeamName = driverDiv.querySelector(".teamName");
      const existingPhotoURL = driverDiv.querySelector(".photoURL");
      const createdDate = data.find((driver) => driver.id === parseInt(driverId))?.createdAt;

      // Create a input element in the place of the text that we are replacing, saving inside the text that is there
      const inputName = document.createElement("input");
      inputName.value = existingDriverName.textContent;
      inputName.className = "js-edit-input";
      const inputRacesWon = document.createElement("input");
      inputRacesWon.value = existingRacesWon.textContent;
      inputRacesWon.className = "js-edit-input";
      const inputFavTrack = document.createElement("input");
      inputFavTrack.value = existingFavTrack.textContent;
      inputFavTrack.className = "js-edit-input";
      const inputTeamName = document.createElement("input");
      inputTeamName.value = existingTeamName.textContent;
      inputTeamName.className = "js-edit-input";
      const photoUrlText = existingPhotoURL.getAttribute("src");
      const inputPhotoURL = document.createElement("input");
      inputPhotoURL.value = photoUrlText;
      inputPhotoURL.className = "js-edit-input";

      // Replace the existing with the new input
      existingDriverName.parentNode.replaceChild(inputName, existingDriverName);
      existingRacesWon.parentNode.replaceChild(inputRacesWon, existingRacesWon);
      existingFavTrack.parentNode.replaceChild(inputFavTrack, existingFavTrack);
      existingTeamName.parentNode.replaceChild(inputTeamName, existingTeamName);
      existingPhotoURL.parentNode.replaceChild(inputPhotoURL, existingPhotoURL);

      // Save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.className = "button button-save js-save-button";

      // Replace the edit button with a save button
      editBtn.parentNode.replaceChild(saveButton, editBtn);

      // When the save button is clicked the inputed values get saved in a variable
      saveButton.addEventListener("click", () => {
        const editedDriverName = inputName.value;
        const editedRacesWon = inputRacesWon.value;
        const editedFavTrack = inputFavTrack.value;
        const editedTeamName = inputTeamName.value;
        const editedPhotoURL = inputPhotoURL.value;

        // With put replace the existing values in the db with the new ones and redraw the page
      axios.put(`http://localhost:3004/drivers/${driverId}`, {
        name: editedDriverName,
        racesWon: editedRacesWon,
        favTrack: editedFavTrack,
        teamName: editedTeamName,
        photoURL: editedPhotoURL,
        createdAt: createdDate,
      }).then(() => {
        fetchData();
        });
      });
    });
  });
};


// Register form
const handleFormSubmit = (event: Event) => {
  // Prevent default so the page doesnt reload after pressing submit
  event.preventDefault();

  // Select the input fields
  const driverNameInput = driverForm.querySelector<HTMLInputElement>('input[name="driverName"]');
  const racesWonInput = driverForm.querySelector<HTMLInputElement>('input[name="racesWon"]');
  const favTrackInput = driverForm.querySelector<HTMLInputElement>('input[name="favTrack"]');
  const teamNameInput = driverForm.querySelector<HTMLInputElement>('input[name="teamName"]');
  const photoURLInput = driverForm.querySelector<HTMLInputElement>('input[name="photoURL"]');

  // Put the inputed values into a varible
  const driverInputValue = driverNameInput.value;
  const racesWonInputValue = racesWonInput.value;
  const favTrackInputValue = favTrackInput.value;
  const teamNameInputValue = teamNameInput.value;
  const photoURLInputValue = photoURLInput.value;

  // Post those variables into a db in their respective fields
  axios.post<Driver>("http://localhost:3004/drivers", {
    name: driverInputValue,
    racesWon: racesWonInputValue,
    favTrack: favTrackInputValue,
    teamName: teamNameInputValue,
    photoURL: photoURLInputValue,
    createdAt: new Date(),

  // Then clear the input in the forms and redraw the page
  }).then(() => {
    if (driverForm instanceof HTMLFormElement) {
      driverForm.reset();
    }
    fetchData();
  })
};

// Add a event listener to the driver form and when its submitted run the function
driverForm.addEventListener("submit", handleFormSubmit);

// Function for drawing the page
const fetchData = () => {

  // Clear the page of any info that is there
  driverWrapper.innerHTML = "";

  // Get the driver db and store the data in the data variable
  axios.get<Driver[]>("http://localhost:3004/drivers").then((response) => {
    const data = response.data;

    // If the db doesn't have any entries then display the empty db message
    if (data.length === 0) {
      displayEmptyDbMessage();
    // Else display the info for each driver and add delete & edit buttons to the drivers card
    } else {
      data.forEach((driver: Driver) => {
        displayDriverInfo(driver);
      });
      addDeleteButtonListeners();
      addEditButtonListeners(data);
    }
  })
};

fetchData();