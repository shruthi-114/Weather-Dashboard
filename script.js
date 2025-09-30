const apiKey = "507ec73cd530286f93d92f7d65da202b";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }
    fetchWeather(city);
}

async function getWeatherFromDropdown() {
    const city = document.getElementById("quickCity").value;
    if (city) fetchWeather(city);
}

async function fetchWeather(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok) throw new Error("City not found");
        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        document.getElementById("weatherResult").innerHTML = `
            <h2>${currentData.name}, ${currentData.sys.country}</h2>
            <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>🌡 Temperature: ${currentData.main.temp} °C</p>
            <p>🌥 Condition: ${currentData.weather[0].description}</p>
            <p>💨 Wind Speed: ${currentData.wind.speed} m/s</p>
            <p>💧 Humidity: ${currentData.main.humidity}%</p>
        `;

        
        const forecastHTML = forecastData.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .slice(0, 5)
            .map(day => `
                <div class="forecast-day">
                    <p>${new Date(day.dt_txt).toDateString()}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
                    <p>${day.main.temp} °C</p>
                    <p>${day.weather[0].description}</p>
                </div>
            `).join("");

        document.getElementById("forecastResult").innerHTML = `
            <h3>📅 5-Day Forecast</h3>
            <div class="forecast-grid">${forecastHTML}</div>
        `;

    } catch (error) {
        document.getElementById("weatherResult").innerHTML =
            `<p style="color:red;">${error.message}</p>`;
    }
}


document.getElementById("themeToggle").addEventListener("change", function() {
    document.body.classList.toggle("night");
});
