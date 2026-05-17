async function fetchWeather(location) {
  const response = await fetch(
    `/api/weather?location=${encodeURIComponent(location)}`
  );
  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new Error(data.message || "Failed to fetch weather data");
}

function displayWeather(data) {
  const weatherDisplay = document.getElementById("weather-display");
  const locationName = document.getElementById("location-name");
  const temperature = document.getElementById("temperature");
  const condition = document.getElementById("condition");
  const windSpeed = document.getElementById("wind-speed");
  const humidity = document.getElementById("humidity");
  const feelsLike = document.getElementById("feels-like");

  locationName.textContent = data.name;
  temperature.textContent = Math.round(data.main.temp);
  condition.textContent = data.weather[0].description;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  humidity.textContent = `${data.main.humidity}%`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)} C`;
  weatherDisplay.style.display = "block";
}

function toggleElementVisibility(id, show) {
  const element = document.getElementById(id);
  element.style.display = show ? "block" : "none";
}

function showError(message) {
  const error = document.getElementById("error");
  error.textContent = message;
  toggleElementVisibility("error", true);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchButton = document.getElementById("search-button");
  const locationInput = document.getElementById("location-input");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    toggleElementVisibility("loading", true);
    toggleElementVisibility("error", false);
    toggleElementVisibility("weather-display", false);
    searchButton.disabled = true;

    const location = locationInput.value.trim();

    if (!location) {
      toggleElementVisibility("loading", false);
      searchButton.disabled = false;
      showError("Please enter a location.");
      return;
    }

    try {
      const weatherData = await fetchWeather(location);
      toggleElementVisibility("loading", false);
      displayWeather(weatherData);
    } catch (error) {
      toggleElementVisibility("loading", false);
      showError(error.message);
    } finally {
      searchButton.disabled = false;
    }
  });
});
