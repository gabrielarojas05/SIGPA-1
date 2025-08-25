const $ = (sel) => document.querySelector(sel);
const statusEl = $('#status');
const statusText = $('#statusText');

function setStatus(text, show = true) {
    statusText.textContent = text;
    statusEl.classList.toggle('status--show', show);
}

// ============================
// Fetch con Open-Meteo
// ============================
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weathercode,wind_speed_10m&hourly=precipitation_probability&timezone=auto`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo obtener el clima");
    return res.json();
}

// ============================
// Renderizar datos en pantalla
// ============================
function renderWeather(city, data) {
    const current = data.current;
    const hourly = data.hourly;

  // Temperatura actual
    $('#temp').textContent = `${Math.round(current.temperature_2m)}°C`;
    $('#humidity').textContent = `${current.relative_humidity_2m}%`;
    $('#wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    $('#cond').textContent = "Condiciones actuales";
    $('#cityName').textContent = city;
    $('#date').textContent = new Date(current.time).toLocaleString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit"
    });

  // Probabilidad de lluvia (primer valor horario disponible)
    const pop = hourly.precipitation_probability[0];
    $('#pop').textContent = `${pop}%`;

  // === Alertas ===
    const alerts = [];
    if (pop >= 60) 
    alerts.push({ text: "Evite realizar riegos", badge: `POP ${pop}%` });

    if (current.temperature_2m < 8) 
    alerts.push({ text: "Riesgo de helada", badge: `${current.temperature_2m}°C` });

    if (current.temperature_2m > 32) 
    alerts.push({ text: "Riesgo de golpe de calor", badge: `${current.temperature_2m}°C` });

    const alertsBox = $('#alerts');
    alertsBox.innerHTML = '';
    if (!alerts.length) {
    alertsBox.innerHTML = '<div class="muted">No hay alertas por ahora.</div>';
    } else {
    alerts.forEach(a => {
        const node = document.createElement('div');
        node.className = 'alert';
        node.innerHTML = `
        <div class="alert__icon">!</div>
        <div class="alert__text">${a.text}</div>
        <div class="alert__badge">${a.badge}</div>
        `;
        alertsBox.appendChild(node);
    });
    }
}

// ============================
// Geocodificación (Open-Meteo)
// ============================
async function geocodeCity(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo geocodificar la ciudad');
    const data = await res.json();
    if (!data?.results?.length) throw new Error('Ciudad no encontrada');
    const { latitude, longitude, name, country } = data.results[0];
    return { lat: latitude, lon: longitude, name, country };
}

// ============================
// Búsqueda por input
// ============================
async function handleSearch(input) {
    setStatus('Buscando…');
    try {
    let lat, lon, metaCity = '';

    const coordMatch = input.match(/^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
    if (coordMatch) {
        lat = parseFloat(coordMatch[1]);
        lon = parseFloat(coordMatch[2]);
        metaCity = 'Coordenadas';
    } else {
        const g = await geocodeCity(input);
        lat = g.lat; lon = g.lon; metaCity = `${g.name}, ${g.country}`;
    }

    const data = await fetchWeather(lat, lon);
    renderWeather(metaCity, data);
    setStatus('Listo', false);
    } catch (err) {
    console.error(err);
    setStatus('Error');
    alert(err.message || 'Ocurrió un error al obtener el clima');
    }
}

// ============================
// Geolocalización
// ============================
function useGeolocation() {
    if (!navigator.geolocation) return alert('La geolocalización no está disponible.');
    setStatus('Obteniendo ubicación…');
    navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
        const data = await fetchWeather(latitude, longitude);
        renderWeather("Mi ubicación", data);
        setStatus('Listo', false);
    } catch (e) {
        console.error(e);
        setStatus('Error');
        alert('No se pudo obtener el clima con su ubicación.');
    }
    }, (err) => {
    console.warn(err);
    setStatus('Listo', false);
    alert('No fue posible acceder a la ubicación.');
    });
}

// ============================
// Eventos
// ============================
$('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const value = $('#cityInput').value.trim();
    if (!value) return alert('Ingrese una ciudad o coordenadas.');
    handleSearch(value);
});
$('#btnGeo').addEventListener('click', useGeolocation);

// Demo inicial
window.addEventListener('DOMContentLoaded', () => handleSearch('Bogotá'));
