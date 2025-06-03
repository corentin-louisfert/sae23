// Fonctions utilitaires pour la création et gestion des cartes météo

/**
 * Crée une carte météo avec toutes les informations
 * @param {Object} data - Données météo
 * @param {Object} options - Options d'affichage
 * @param {Object} locationData - Données de localisation
 */
function createWeatherCard(data, options = {}, locationData = null) {
  const weatherSection = document.getElementById("weatherInformation");
  
  // Nettoyer la section précédente
  weatherSection.innerHTML = '';
  
  // Créer la carte principale
  const mainCard = document.createElement("div");
  mainCard.classList.add("weather-card-main");
  
  let cardContent = `
    <div class="weather-header">
      <h2>${data.city?.name || 'Ville inconnue'}</h2>
      <p class="weather-date">${new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</p>
    </div>
  `;
  
  // Ajouter les informations de localisation si demandées
  if (locationData && (options.latitude || options.longitude)) {
    cardContent += createLocationSection(locationData, options);
  }
  
  mainCard.innerHTML = cardContent;
  weatherSection.appendChild(mainCard);
  
  // Afficher la section
  weatherSection.style.display = "block";
}

/**
 * Crée la section des informations de localisation
 * @param {Object} locationData - Données de localisation
 * @param {Object} options - Options d'affichage
 */
function createLocationSection(locationData, options) {
  let locationHtml = '<div class="location-section">';
  locationHtml += '<h3><i class="fas fa-map-marker-alt"></i> Localisation</h3>';
  
  if (options.latitude && locationData.centre) {
    locationHtml += `
      <div class="location-item">
        <i class="fas fa-globe-americas"></i>
        <span>Latitude: ${locationData.centre.coordinates[1].toFixed(6)}°</span>
      </div>
    `;
  }
  
  if (options.longitude && locationData.centre) {
    locationHtml += `
      <div class="location-item">
        <i class="fas fa-globe-americas"></i>
        <span>Longitude: ${locationData.centre.coordinates[0].toFixed(6)}°</span>
      </div>
    `;
  }
  
  locationHtml += '</div>';
  return locationHtml;
}

/**
 * Crée une carte météo pour un jour spécifique
 * @param {Object} dayData - Données météo du jour
 * @param {number} index - Index du jour
 * @param {Object} options - Options d'affichage
 */
function createDayCard(dayData, index, options = {}) {
  const dayCard = document.createElement("div");
  dayCard.classList.add("weather-day");
  
  const dayLabel = getDayLabel(index, dayData.datetime);
  const weatherIcon = getWeatherIcon(dayData.weather);
  const weatherDesc = getWeatherDescription(dayData.weather);
  
  let cardContent = `
    <div class="day-header">
      <h3>${dayLabel}</h3>
      <p class="day-date">${new Date(dayData.datetime).toLocaleDateString('fr-FR')}</p>
    </div>
    
    <div class="weather-icon">
      <i class="${weatherIcon}"></i>
    </div>
    
    <div class="temperature-section">
      <div class="temp-main">
        <span class="temp-max">${dayData.tmax}°C</span>
        <span class="temp-min">${dayData.tmin}°C</span>
      </div>
      <p class="weather-description">${weatherDesc}</p>
    </div>
    
    <div class="weather-details">
  `;
  
  // Ajouter les détails météo de base
  cardContent += createBasicWeatherDetails(dayData);
  
  // Ajouter les détails optionnels selon les options sélectionnées
  cardContent += createOptionalWeatherDetails(dayData, options);
  
  cardContent += `
    </div>
  `;
  
  dayCard.innerHTML = cardContent;
  return dayCard;
}

/**
 * Crée les détails météo de base
 * @param {Object} dayData - Données météo du jour
 */
function createBasicWeatherDetails(dayData) {
  let detailsHtml = '';
  
  // Probabilité de pluie
  if (dayData.probarain !== undefined) {
    detailsHtml += `
      <div class="weather-detail">
        <i class="fas fa-cloud-rain"></i>
        <span>Probabilité pluie</span>
        <strong>${dayData.probarain}%</strong>
      </div>
    `;
  }
  
  // Ensoleillement
  if (dayData.sun_hours !== undefined) {
    detailsHtml += `
      <div class="weather-detail">
        <i class="fas fa-sun"></i>
        <span>Ensoleillement</span>
        <strong>${formatSunHours(dayData.sun_hours)}</strong>
      </div>
    `;
  }
  
  // Humidité
  if (dayData.humidity !== undefined) {
    detailsHtml += `
      <div class="weather-detail">
        <i class="fas fa-tint"></i>
        <span>Humidité</span>
        <strong>${dayData.humidity}%</strong>
      </div>
    `;
  }
  
  return detailsHtml;
}

/**
 * Crée les détails météo optionnels selon les options sélectionnées
 * @param {Object} dayData - Données météo du jour
 * @param {Object} options - Options d'affichage
 */
function createOptionalWeatherDetails(dayData, options) {
  let detailsHtml = '';
  
  // Cumul de pluie
  if (options.rain && dayData.rr1 !== undefined) {
    detailsHtml += `
      <div class="weather-detail highlight">
        <i class="fas fa-tint"></i>
        <span>Cumul pluie</span>
        <strong>${dayData.rr1} mm</strong>
      </div>
    `;
  }
  
  // Vent moyen
  if (options.wind && dayData.wind10m !== undefined) {
    detailsHtml += `
      <div class="weather-detail highlight">
        <i class="fas fa-wind"></i>
        <span>Vent moyen</span>
        <strong>${dayData.wind10m} km/h</strong>
      </div>
    `;
  }
  
  // Direction du vent
  if (options.windDirection && dayData.dirwind10m !== undefined) {
    const windDirection = getWindDirection(dayData.dirwind10m);
    detailsHtml += `
      <div class="weather-detail highlight">
        <i class="fas fa-compass"></i>
        <span>Direction vent</span>
        <strong>${windDirection} (${dayData.dirwind10m}°)</strong>
      </div>
    `;
  }
  
  // Rafales de vent
  if (dayData.gustx !== undefined && dayData.gustx > 0) {
    detailsHtml += `
      <div class="weather-detail">
        <i class="fas fa-wind"></i>
        <span>Rafales</span>
        <strong>${dayData.gustx} km/h</strong>
      </div>
    `;
  }
  
  return detailsHtml;
}

/**
 * Crée un bouton de nouvelle recherche
 */
function createReloadButton() {
  const reloadButton = document.createElement("button");
  reloadButton.classList.add("reloadButton");
  reloadButton.innerHTML = '<i class="fas fa-redo"></i> Nouvelle recherche';
  
  reloadButton.addEventListener("click", function() {
    // Animation de chargement
    reloadButton.innerHTML = '<div class="loading"></div> Chargement...';
    reloadButton.disabled = true;
    
    setTimeout(() => {
      location.reload();
    }, 500);
  });
  
  return reloadButton;
}

/**
 * Formate les heures d'ensoleillement
 * @param {number} sunHours - Heures d'ensoleillement
 */
function formatSunHours(sunHours) {
  if (sunHours === 0) return "0h";
  if (sunHours < 1) return `${Math.round(sunHours * 60)}min`;
  
  const hours = Math.floor(sunHours);
  const minutes = Math.round((sunHours - hours) * 60);
  
  if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }
}
