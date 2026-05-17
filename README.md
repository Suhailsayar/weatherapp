# Weather App

A clean, responsive weather app that searches current conditions by city. The OpenWeather API key is kept server-side behind a local/Vercel API endpoint, so it is not exposed in browser JavaScript.

## Live Demo

[https://weatherapp-lime-eight.vercel.app](https://weatherapp-lime-eight.vercel.app)

## Features

- Search current weather by city
- Responsive glass-style interface
- Temperature, condition, wind, humidity, and feels-like readings
- Server-side `/api/weather` endpoint for hiding the OpenWeather key
- Local development server with `.env` support
- Vercel-ready API route

## Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

Run the app locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel Environment Variable

Set this environment variable in the Vercel project before deploying:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

The key should be rotated if it was ever committed or exposed in frontend code.

## Scripts

```bash
npm run dev
npm start
npm run check
```

## Deployment

The project is deployed on Vercel. The production alias is:

[https://weatherapp-lime-eight.vercel.app](https://weatherapp-lime-eight.vercel.app)
