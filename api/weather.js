module.exports = async function handler(request, response) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const location = request.query.location;

  if (!apiKey) {
    return response.status(500).json({
      message: "Weather API key is not configured.",
    });
  }

  if (!location || !location.trim()) {
    return response.status(400).json({
      message: "Please provide a location.",
    });
  }

  const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  weatherUrl.searchParams.set("q", location.trim());
  weatherUrl.searchParams.set("appid", apiKey);
  weatherUrl.searchParams.set("units", "metric");

  try {
    const weatherResponse = await fetch(weatherUrl);
    const data = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return response.status(weatherResponse.status).json({
        message: data.message || "Failed to fetch weather data.",
      });
    }

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to reach the weather service.",
    });
  }
};
