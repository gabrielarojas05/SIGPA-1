// ===== WEATHER SERVICE =====

export class WeatherService {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.currentWeather = null;
        this.forecast = null;
        this.lastUpdate = null;
        this.updateInterval = null;
        this.isPaused = false;

        // Default location (can be updated via user preferences)
        this.location = {
            lat: 19.4326,  // Mexico City coordinates
            lon: -99.1332,
            city: 'Ciudad de México',
            country: 'MX'
        };

        // Weather widget element
        this.weatherWidget = null;

        // Bind methods
        this.updateWeather = this.updateWeather.bind(this);
        this.handleWeatherUpdate = this.handleWeatherUpdate.bind(this);
    }

    async initialize() {
        try {
            console.log('🌤️ Initializing Weather Service...');

            // Try to get API key from environment or localStorage
            this.apiKey = this.getApiKey();

            if (!this.apiKey) {
                console.warn('⚠️ No weather API key found. Using mock data.');
                this.useMockData = true;
            }

            // Get user location if available
            await this.getUserLocation();

            // Setup weather widget
            this.setupWeatherWidget();

            // Start periodic updates
            this.startUpdates();

            console.log('✅ Weather Service initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize Weather Service:', error);
            this.useMockData = true;
        }
    }

    getApiKey() {
        try {
            // Try to get from environment variable (for production)
            if (typeof process !== 'undefined' && process.env.WEATHER_API_KEY) {
                return process.env.WEATHER_API_KEY;
            }

            // Try to get from localStorage
            return localStorage.getItem('weather-api-key');

        } catch (error) {
            console.error('❌ Error getting API key:', error);
            return null;
        }
    }

    async getUserLocation() {
        try {
            if ('geolocation' in navigator) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 600000 // 10 minutes
                    });
                });

                this.location.lat = position.coords.latitude;
                this.location.lon = position.coords.longitude;

                // Reverse geocode to get city name
                await this.reverseGeocode(this.location.lat, this.location.lon);

                console.log('📍 User location obtained:', this.location);

            } else {
                console.log('📍 Geolocation not available, using default location');
            }

        } catch (error) {
            console.warn('⚠️ Could not get user location, using default:', error);
        }
    }

    async reverseGeocode(lat, lon) {
        try {
            if (!this.apiKey) return;

            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
            );

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    this.location.city = data[0].name;
                    this.location.country = data[0].country;
                }
            }

        } catch (error) {
            console.error('❌ Error reverse geocoding:', error);
        }
    }

    setupWeatherWidget() {
        try {
            this.weatherWidget = document.getElementById('weatherWidget');

            if (this.weatherWidget) {
                // Add click handler for weather details
                this.weatherWidget.addEventListener('click', () => {
                    this.showWeatherDetails();
                });

                // Make it look clickable
                this.weatherWidget.style.cursor = 'pointer';
                this.weatherWidget.title = 'Click for weather details';
            }

        } catch (error) {
            console.error('❌ Error setting up weather widget:', error);
        }
    }

    async updateWeather() {
        try {
            if (this.isPaused) return;

            console.log('🌤️ Updating weather data...');

            if (this.useMockData) {
                await this.updateWeatherMock();
            } else {
                await this.updateWeatherReal();
            }

            this.lastUpdate = new Date();

            // Update widget display
            this.updateWeatherWidget();

            // Dispatch weather update event
            this.dispatchEvent('weather:updated', {
                current: this.currentWeather,
                forecast: this.forecast,
                location: this.location
            });

            console.log('✅ Weather updated successfully');

        } catch (error) {
            console.error('❌ Failed to update weather:', error);
            this.updateWeatherWidgetError();
        }
    }

    async updateWeatherReal() {
        try {
            if (!this.apiKey) {
                throw new Error('No API key available');
            }

            // Get current weather
            const currentResponse = await fetch(
                `${this.baseUrl}/weather?lat=${this.location.lat}&lon=${this.location.lon}&appid=${this.apiKey}&units=metric&lang=es`
            );

            if (!currentResponse.ok) {
                throw new Error(`Weather API error: ${currentResponse.status}`);
            }

            this.currentWeather = await currentResponse.json();

            // Get 5-day forecast
            const forecastResponse = await fetch(
                `${this.baseUrl}/forecast?lat=${this.location.lat}&lon=${this.location.lon}&appid=${this.apiKey}&units=metric&lang=es`
            );

            if (forecastResponse.ok) {
                this.forecast = await forecastResponse.json();
            }

        } catch (error) {
            console.error('❌ Error updating real weather:', error);
            throw error;
        }
    }

    async updateWeatherMock() {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock current weather data
            this.currentWeather = {
                main: {
                    temp: 25.5,
                    feels_like: 26.2,
                    humidity: 65,
                    pressure: 1013
                },
                weather: [{
                    main: 'Clear',
                    description: 'cielo despejado',
                    icon: '01d'
                }],
                wind: {
                    speed: 3.2,
                    deg: 180
                },
                dt: Math.floor(Date.now() / 1000),
                name: this.location.city
            };

            // Mock forecast data
            this.forecast = {
                list: [
                    {
                        dt: Math.floor(Date.now() / 1000) + 86400,
                        main: { temp: 26.1 },
                        weather: [{ main: 'Clouds', description: 'nubes dispersas' }]
                    },
                    {
                        dt: Math.floor(Date.now() / 1000) + 172800,
                        main: { temp: 24.8 },
                        weather: [{ main: 'Rain', description: 'lluvia ligera' }]
                    }
                ]
            };

        } catch (error) {
            console.error('❌ Error updating mock weather:', error);
            throw error;
        }
    }

    updateWeatherWidget() {
        try {
            if (!this.weatherWidget) return;

            if (this.currentWeather) {
                const temp = Math.round(this.currentWeather.main.temp);
                const description = this.currentWeather.weather[0].description;
                const icon = this.getWeatherIcon(this.currentWeather.weather[0].icon);

                this.weatherWidget.innerHTML = `
                    <i class="bi ${icon}"></i>
                    <span>${temp}°C ${description}</span>
                `;

                // Remove error state
                this.weatherWidget.classList.remove('error');

            } else {
                this.weatherWidget.innerHTML = `
                    <i class="bi bi-cloud-sun"></i>
                    <span>Cargando clima...</span>
                `;
            }

        } catch (error) {
            console.error('❌ Error updating weather widget:', error);
        }
    }

    updateWeatherWidgetError() {
        try {
            if (!this.weatherWidget) return;

            this.weatherWidget.innerHTML = `
                <i class="bi bi-exclamation-triangle"></i>
                <span>Error clima</span>
            `;

            this.weatherWidget.classList.add('error');

        } catch (error) {
            console.error('❌ Error updating weather widget error:', error);
        }
    }

    getWeatherIcon(iconCode) {
        try {
            const iconMap = {
                '01d': 'bi-sun',           // clear sky day
                '01n': 'bi-moon',          // clear sky night
                '02d': 'bi-cloud-sun',     // few clouds day
                '02n': 'bi-cloud-moon',    // few clouds night
                '03d': 'bi-cloud',         // scattered clouds
                '03n': 'bi-cloud',
                '04d': 'bi-clouds',        // broken clouds
                '04n': 'bi-clouds',
                '09d': 'bi-cloud-rain',    // shower rain
                '09n': 'bi-cloud-rain',
                '10d': 'bi-cloud-rain',    // rain
                '10n': 'bi-cloud-rain',
                '11d': 'bi-lightning',     // thunderstorm
                '11n': 'bi-lightning',
                '13d': 'bi-snow',          // snow
                '13n': 'bi-snow',
                '50d': 'bi-mist',          // mist
                '50n': 'bi-mist'
            };

            return iconMap[iconCode] || 'bi-cloud-sun';

        } catch (error) {
            console.error('❌ Error getting weather icon:', error);
            return 'bi-cloud-sun';
        }
    }

    showWeatherDetails() {
        try {
            if (!this.currentWeather) return;

            // Create weather details modal
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Clima en ${this.location.city}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="weather-current">
                            <h4>Condición Actual</h4>
                            <div class="weather-info">
                                <p><strong>Temperatura:</strong> ${Math.round(this.currentWeather.main.temp)}°C</p>
                                <p><strong>Sensación:</strong> ${Math.round(this.currentWeather.main.feels_like)}°C</p>
                                <p><strong>Humedad:</strong> ${this.currentWeather.main.humidity}%</p>
                                <p><strong>Presión:</strong> ${this.currentWeather.main.pressure} hPa</p>
                                <p><strong>Viento:</strong> ${this.currentWeather.wind.speed} m/s</p>
                                <p><strong>Descripción:</strong> ${this.currentWeather.weather[0].description}</p>
                            </div>
                        </div>
                        ${this.forecast ? `
                        <div class="weather-forecast">
                            <h4>Pronóstico</h4>
                            <div class="forecast-items">
                                ${this.forecast.list.slice(0, 3).map(item => `
                                    <div class="forecast-item">
                                        <div class="forecast-date">${new Date(item.dt * 1000).toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                                        <div class="forecast-temp">${Math.round(item.main.temp)}°C</div>
                                        <div class="forecast-desc">${item.weather[0].description}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
                    </div>
                </div>
            `;

            // Add close functionality
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => modal.remove());

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            document.body.appendChild(modal);

        } catch (error) {
            console.error('❌ Error showing weather details:', error);
        }
    }

    startUpdates() {
        try {
            // Update immediately
            this.updateWeather();

            // Set up periodic updates (every 30 minutes)
            this.updateInterval = setInterval(() => {
                this.updateWeather();
            }, 30 * 60 * 1000);

            console.log('✅ Weather updates started');

        } catch (error) {
            console.error('❌ Error starting weather updates:', error);
        }
    }

    pauseUpdates() {
        try {
            this.isPaused = true;
            console.log('⏸️ Weather updates paused');
        } catch (error) {
            console.error('❌ Error pausing weather updates:', error);
        }
    }

    resumeUpdates() {
        try {
            this.isPaused = false;
            console.log('▶️ Weather updates resumed');

            // Update immediately when resuming
            this.updateWeather();
        } catch (error) {
            console.error('❌ Error resuming weather updates:', error);
        }
    }

    dispatchEvent(eventName, detail = {}) {
        try {
            const event = new CustomEvent(eventName, {
                detail,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('❌ Error dispatching event:', error);
        }
    }

    // Public API methods
    getCurrentWeather() {
        return this.currentWeather;
    }

    getForecast() {
        return this.forecast;
    }

    getLocation() {
        return this.location;
    }

    setLocation(lat, lon, city, country) {
        try {
            this.location = { lat, lon, city, country };

            // Update weather for new location
            this.updateWeather();

            console.log('📍 Location updated:', this.location);

        } catch (error) {
            console.error('❌ Error setting location:', error);
        }
    }

    setApiKey(apiKey) {
        try {
            this.apiKey = apiKey;
            this.useMockData = false;

            // Save to localStorage
            localStorage.setItem('weather-api-key', apiKey);

            // Update weather with real API
            this.updateWeather();

            console.log('🔑 API key updated');

        } catch (error) {
            console.error('❌ Error setting API key:', error);
        }
    }

    // Cleanup method
    cleanup() {
        try {
            // Clear update interval
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            // Remove event listeners
            if (this.weatherWidget) {
                this.weatherWidget.removeEventListener('click', this.showWeatherDetails);
            }

            console.log('✅ Weather Service cleanup completed');

        } catch (error) {
            console.error('❌ Error during weather service cleanup:', error);
        }
    }
}
