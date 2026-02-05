// ================= CONFIG =================
const API_KEY = "1cc40bc4a7c7442cb2385033260502";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";
const AQI_TOKEN = "8c48a166d82da6ebc1c5b1d1702545ea7da12a3e";
// ================= ELEMENTS =================
const countryInput = document.getElementById("country-input");
const cityInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const tempText = document.querySelector(".temp-info h1");
const conditionText = document.querySelector(".temp-info p");
const cityText = document.querySelector(".card-header h3");
const weatherIcon = document.querySelector(".temp-icon");

const visibilityEl = document.getElementById("visibility");
const visibilityText = document.getElementById("visibility-text");
const windEl = document.getElementById("wind");
const windText = document.getElementById("wind-text");
const pressureEl = document.getElementById("pressure");
const humidityEl = document.getElementById("humidity");
const aqiEl = document.getElementById("aqi");
const aqiText = document.getElementById("aqi-text");
const uvEl = document.getElementById("uv");
const uvText = document.getElementById("uv-text");

// ================= FETCH WEATHER =================
async function getWeather(country, city) {
  if (!country || !city) {
    alert("Please enter both country and city");
    return;
  }

  const query = `${city},${country}`;

  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&aqi=yes`
    );

    if (!response.ok) throw new Error("Location not found");

    const data = await response.json();
    updateUI(data);

  } catch (error) {
    alert("Invalid city or country");
    console.error(error);
  }
}


async function getAQI(city) {
  try {
    const res = await fetch(
      `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${AQI_TOKEN}`
    );

    const data = await res.json();

    if (data.status !== "ok") {
      aqiEl.innerText = "--";
      aqiText.innerText = "Unavailable";
      return;
    }

    const aqi = data.data.aqi;

    aqiEl.innerText = aqi;
    aqiText.innerText = getAQIText(aqi);

  } catch (err) {
    console.error("AQI error:", err);
    aqiEl.innerText = "--";
    aqiText.innerText = "Unavailable";
  }
}



// ================= UPDATE UI =================
function updateUI(data) {
  const c = data.current;
  const l = data.location;

  // main weather
  tempText.innerText = `${c.temp_c}°C`;
  conditionText.innerText = c.condition.text;
  cityText.innerHTML = `${l.name}, ${l.country} <span>${getTime()}</span>`;
  weatherIcon.innerText = getTemperatureSymbol(c.temp_c);

  // visibility
  visibilityEl.innerText = `${c.vis_km} km`;
  visibilityText.innerText = c.vis_km >= 5 ? "Good" : "Poor";

  // wind
  windEl.innerText = `${c.wind_kph} km/h`;
  windText.innerText = c.wind_dir;

  // pressure
  pressureEl.innerText = `${c.pressure_mb} mb`;

  // humidity
  humidityEl.innerText = `${c.humidity}%`;

  // AQI (PM2.5)

uvEl.innerText = c.uv;
uvText.innerText = getUVText(c.uv);

// AQI (REAL AQI INDEX)
getAQI(l.name);


  // UV
  uvEl.innerText = c.uv;
  uvText.innerText = getUVText(c.uv);
}

// ================= HELPERS =================
function getTemperatureSymbol(temp) {
  if (temp >= 35) return "🔥";
  if (temp >= 25) return "☀️";
  if (temp >= 18) return "🌤️";
  if (temp >= 10) return "☁️";
  if (temp >= 5) return "🌧️";
  return "❄️";
}

function getAQIText(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy";
  if (aqi <= 200) return "Very Unhealthy";
  return "Hazardous";
}

function getUVText(uv) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ================= EVENTS =================
searchBtn.addEventListener("click", () => {
  const country = countryInput.value.trim();
  const city = cityInput.value.trim();
  getWeather(country, city);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather(countryInput.value.trim(), cityInput.value.trim());
  }
});

// ================= DEFAULT LOAD =================
getWeather("India", "Delhi");
