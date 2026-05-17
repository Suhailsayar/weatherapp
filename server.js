const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnv();

const port = process.env.PORT || 3000;
const publicDir = __dirname;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname === "/api/weather") {
    await handleWeatherRequest(requestUrl, response);
    return;
  }

  serveStaticFile(requestUrl.pathname, response);
});

server.listen(port, () => {
  console.log(`Weather app running at http://localhost:${port}`);
});

async function handleWeatherRequest(requestUrl, response) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const location = requestUrl.searchParams.get("location");

  if (!apiKey) {
    sendJson(response, 500, {
      message: "Weather API key is not configured.",
    });
    return;
  }

  if (!location || !location.trim()) {
    sendJson(response, 400, {
      message: "Please provide a location.",
    });
    return;
  }

  const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  weatherUrl.searchParams.set("q", location.trim());
  weatherUrl.searchParams.set("appid", apiKey);
  weatherUrl.searchParams.set("units", "metric");

  try {
    const weatherResponse = await fetch(weatherUrl);
    const data = await weatherResponse.json();

    if (!weatherResponse.ok) {
      sendJson(response, weatherResponse.status, {
        message: data.message || "Failed to fetch weather data.",
      });
      return;
    }

    sendJson(response, 200, data);
  } catch (error) {
    sendJson(response, 500, {
      message: "Unable to reach the weather service.",
    });
  }
}

function serveStaticFile(pathname, response) {
  const normalizedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(publicDir, normalizedPath);

  if (!filePath.startsWith(publicDir)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendText(response, 404, "Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "text/plain",
    });
    response.end(content);
  });
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end(message);
}

function loadEnv() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
