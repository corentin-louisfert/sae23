// Sélection des éléments
const codePostalInput = document.getElementById("code-postal");
const communeSelect = document.getElementById("communeSelect");
const validationButton = document.getElementById("validationButton");
const forecastDaysRange = document.getElementById("forecastDays");
const daysValueDisplay = document.getElementById("daysValue");
const daysPluralDisplay = document.getElementById("daysPlurial");
const darkModeToggle = document.getElementById("darkModeToggle");

// Variables globales
let currentLocationData = null;
let weatherHistory = [];

// Fonction pour effectuer la requête API des communes en utilisant le code postal
async function fetchCommunesByCodePostal(codePostal) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom,code,codesPostaux,centre,population`
    );
    const data = await response.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API communes:", error);
    throw error;
  }
}

// Fonction pour obtenir les coordonnées d'une commune
async function fetchCommuneCoordinates(inseeCode) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes/${inseeCode}?fields=nom,centre,population`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des coordonnées:", error);
    return null;
  }
}

// Fonction pour afficher les communes dans la liste déroulante
function displayCommunes(data) {
  communeSelect.innerHTML = "";
  
  if (data.length) {
    // Ajouter une option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Sélectionnez une commune";
    communeSelect.appendChild(defaultOption);

    data.forEach((commune) => {
      const option = document.createElement("option");
      option.value = commune.code;
      option.textContent = `${commune.nom} (${commune.population ? commune.population.toLocaleString() : 'N/A'} hab.)`;
      communeSelect.appendChild(option);
    });
    
    communeSelect.style.display = "block";
    updateValidationButtonVisibility();
  } else {
    showErrorMessage("Le code postal saisi n'est pas valide");
    communeSelect.style.display = "none";
    validationButton.style.display = "none";
  }
}

// Fonction pour afficher un message d'erreur
function showErrorMessage(message) {
  // Supprimer un message précédent s'il existe déjà
  const existingMessage = document.getElementById("error-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.id = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
  
  const cityForm = document.getElementById("cityForm");
  cityForm.appendChild(errorDiv);

  // Supprimer automatiquement après 5 secondes
  setTimeout(() => {
    if (document.getElementById("error-message")) {
      errorDiv.remove();
    }
  }, 5000);
}

// Fonction pour effectuer la requête API de météo
async function fetchMeteoByCommune(selectedCommune, days) {
  try {
    const apiKey = '58d953c270b7a398a37aa7195765fe7778969c7a1c49c04879cf5230fdc13f74';
    const response = await fetch(
      `https://api.meteo-concept.com/api/forecast/daily?token=${apiKey}&insee=${selectedCommune}&start=0&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API météo:", error);
    throw error;
  }
}

// Fonction pour obtenir le label du jour
function getDayLabel(index, dateString) {
  if (index === 0) return "Aujourd'hui";
  if (index === 1) return "Demain";

  const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const date = new Date(dateString);
  return jours[date.getDay()];
}

// Fonction pour obtenir l'icône météo
function getWeatherIcon(weather) {
  const weatherIcons = {
    0: "fas fa-sun", // Soleil
    1: "fas fa-sun", // Peu nuageux
    2: "fas fa-cloud-sun", // Ciel voilé
    3: "fas fa-cloud-sun", // Nuageux
    4: "fas fa-cloud", // Très nuageux
    5: "fas fa-cloud", // Couvert
    6: "fas fa-cloud-meatball", // Brouillard
    7: "fas fa-cloud-meatball", // Brouillard givrant
    10: "fas fa-cloud-rain", // Pluie faible
    11: "fas fa-cloud-rain", // Pluie modérée
    12: "fas fa-cloud-showers-heavy", // Pluie forte
    13: "fas fa-cloud-rain", // Pluie faible verglaçante
    14: "fas fa-cloud-rain", // Pluie modérée verglaçante
    15: "fas fa-cloud-rain", // Pluie forte verglaçante
    16: "fas fa-snowflake", // Neige faible
    17: "fas fa-snowflake", // Neige modérée
    18: "fas fa-snowflake", // Neige forte
    20: "fas fa-cloud-rain", // Pluie intermittente faible
    21: "fas fa-cloud-rain", // Pluie intermittente modérée
    22: "fas fa-cloud-showers-heavy", // Pluie intermittente forte
    30: "fas fa-cloud-rain", // Pluie et neige mêlées faibles
    31: "fas fa-cloud-rain", // Pluie et neige mêlées modérées
    32: "fas fa-cloud-rain", // Pluie et neige mêlées fortes
    40: "fas fa-cloud-showers-heavy", // Averses de pluie faible
    41: "fas fa-cloud-showers-heavy", // Averses de pluie modérée
    42: "fas fa-cloud-showers-heavy", // Averses de pluie forte
    43: "fas fa-cloud-rain", // Averses de pluie et neige mêlées faibles
    44: "fas fa-cloud-rain", // Averses de pluie et neige mêlées modérées
    45: "fas fa-cloud-rain", // Averses de pluie et neige mêlées fortes
    46: "fas fa-snowflake", // Averses de neige faible
    47: "fas fa-snowflake", // Averses de neige modérée
    48: "fas fa-snowflake", // Averses de neige forte
    60: "fas fa-bolt", // Orages faibles et locaux
    61: "fas fa-bolt", // Orages modérés et locaux
    62: "fas fa-bolt", // Orages fort et locaux
    70: "fas fa-bolt", // Orages faibles et étendus
    71: "fas fa-bolt", // Orages modérés et étendus
    72: "fas fa-bolt", // Orages forts et étendus
    73: "fas fa-bolt", // Orages faibles avec grêlons
    74: "fas fa-bolt", // Orages modérés avec grêlons
    75: "fas fa-bolt", // Orages forts avec grêlons
    76: "fas fa-bolt", // Orages violents avec grêlons
    77: "fas fa-bolt", // Orages extrêmes
    78: "fas fa-bolt" // Orages exceptionnels
  };
  
  return weatherIcons[weather] || "fas fa-question";
}

// Fonction pour obtenir la description météo
function getWeatherDescription(weather) {
  const descriptions = {
    0: "Soleil",
    1: "Peu nuageux", 
    2: "Ciel voilé",
    3: "Nuageux",
    4: "Très nuageux",
    5: "Couvert",
    6: "Brouillard",
    7: "Brouillard givrant",
    10: "Pluie faible",
    11: "Pluie modérée",
    12: "Pluie forte",
    13: "Pluie verglaçante faible",
    14: "Pluie verglaçante modérée", 
    15: "Pluie verglaçante forte",
    16: "Neige faible",
    17: "Neige modérée",
    18: "Neige forte",
    20: "Pluie intermittente faible",
    21: "Pluie intermittente modérée",
    22: "Pluie intermittente forte",
    30: "Pluie et neige faibles",
    31: "Pluie et neige modérées",
    32: "Pluie et neige fortes",
    40: "Averses faibles",
    41: "Averses modérées",
    42: "Averses fortes",
    43: "Averses de pluie et neige faibles",
    44: "Averses de pluie et neige modérées",
    45: "Averses de pluie et neige fortes",
    46: "Averses de neige faibles",
    47: "Averses de neige modérées",
    48: "Averses de neige fortes",
    60: "Orages faibles",
    61: "Orages modérés",
    62: "Orages forts",
    70: "Orages étendus faibles",
    71: "Orages étendus modérés",
    72: "Orages étendus forts",
    73: "Orages avec grêle faibles",
    74: "Orages avec grêle modérés",
    75: "Orages avec grêle forts",
    76: "Orages violents avec grêle",
    77: "Orages extrêmes",
    78: "Orages exceptionnels"
  };
  
  return descriptions[weather] || "Temps indéterminé";
}

// Fonction pour obtenir la direction du vent
function getWindDirection(degrees) {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Fonction pour mettre à jour l'affichage du nombre de jours
function updateDaysDisplay() {
  const days = parseInt(forecastDaysRange.value);
  daysValueDisplay.textContent = days;
  daysPluralDisplay.style.display = days > 1 ? "inline" : "none";
}

// Fonction pour mettre à jour la visibilité du bouton de validation
function updateValidationButtonVisibility() {
  const codePostal = codePostalInput.value.trim();
  const communeSelected = communeSelect.value;
  
  if (/^\d{5}$/.test(codePostal) && communeSelected) {
    validationButton.style.display = "flex";
  } else {
    validationButton.style.display = "none";
  }
}

// Fonction pour obtenir les options sélectionnées
function getSelectedOptions() {
  return {
    latitude: document.getElementById("showLatitude").checked,
    longitude: document.getElementById("showLongitude").checked,
    rain: document.getElementById("showRain").checked,
    wind: document.getElementById("showWind").checked,
    windDirection: document.getElementById("showWindDirection").checked
  };
}

// Fonction pour sauvegarder l'historique
function saveToHistory(communeName, inseeCode, days, options) {
  const historyItem = {
    communeName,
    inseeCode,
    days,
    options,
    timestamp: new Date().toISOString()
  };
  
  weatherHistory.unshift(historyItem);
  
  // Garder seulement les 10 dernières recherches
  if (weatherHistory.length > 10) {
    weatherHistory = weatherHistory.slice(0, 10);
  }
  
  // Sauvegarder dans le localStorage (si disponible)
  try {
    localStorage.setItem('weatherHistory', JSON.stringify(weatherHistory));
  } catch (e) {
    console.log('LocalStorage non disponible');
  }
}

// Fonction pour charger l'historique
function loadHistory() {
  try {
    const saved = localStorage.getItem('weatherHistory');
    if (saved) {
      weatherHistory = JSON.parse(saved);
    }
  } catch (e) {
    console.log('Impossible de charger l\'historique');
  }
}

// Fonction pour la géolocalisation
function requestGeolocation() {
  const modal = document.getElementById('geoModal');
  modal.style.display = 'block';
  
  const allowBtn = document.getElementById('allowGeo');
  const denyBtn = document.getElementById('denyGeo');
  const closeBtn = modal.querySelector('.close');
  
  function closeModal() {
    modal.style.display = 'none';
  }
  
  allowBtn.onclick = function() {
    closeModal();
    getCurrentLocation();
  };
  
  denyBtn.onclick = closeModal;
  closeBtn.onclick = closeModal;
  
  window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  };
}

// Fonction pour obtenir la position actuelle
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          // Rechercher la commune la plus proche
          const response = await fetch(
            `https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,code,codesPostaux&format=json&geometry=centre`
          );
          const communes = await response.json();
          
          if (communes.length > 0) {
            const commune = communes[0];
            codePostalInput.value = commune.codesPostaux[0];
            
            // Simuler l'événement input pour déclencher la recherche
            const event = new Event('input');
            codePostalInput.dispatchEvent(event);
            
            // Attendre un peu puis sélectionner la commune
            setTimeout(() => {
              communeSelect.value = commune.code;
              updateValidationButtonVisibility();
            }, 500);
          }
        } catch (error) {
          showErrorMessage("Erreur lors de la géolocalisation");
        }
      },
      function(error) {
        showErrorMessage("Géolocalisation refusée ou indisponible");
      }
    );
  } else {
    showErrorMessage("Géolocalisation non supportée par ce navigateur");
  }
}

// Fonction pour basculer le mode sombre
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.getAttribute('data-theme') === 'dark';
  
  if (isDarkMode) {
    body.removeAttribute('data-theme');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', 'false');
  } else {
    body.setAttribute('data-theme', 'dark');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', 'true');
  }
}

// Fonction pour charger les préférences
function loadPreferences() {
  try {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      document.body.setAttribute('data-theme', 'dark');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  } catch (e) {
    console.log('Impossible de charger les préférences');
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  loadHistory();
  
  // Afficher modal de géolocalisation au chargement
  setTimeout(() => {
    requestGeolocation();
  }, 1000);

  // Event listener pour le champ code postal
  codePostalInput.addEventListener('input', async () => {
    const codePostal = codePostalInput.value.trim();
    communeSelect.style.display = "none";
    validationButton.style.display = "none";
    
    // Supprimer les messages d'erreur existants
    const existingError = document.getElementById("error-message");
    if (existingError) {
      existingError.remove();
    }

    if (/^\d{5}$/.test(codePostal)) {
      try {
        const data = await fetchCommunesByCodePostal(codePostal);
        displayCommunes(data);
      } catch (error) {
        showErrorMessage("Une erreur est survenue lors de la recherche de la commune");
      }
    }
  });

  // Event listener pour la sélection de commune
  communeSelect.addEventListener('change', updateValidationButtonVisibility);

  // Event listener pour le slider des jours
  forecastDaysRange.addEventListener('input', updateDaysDisplay);

  // Event listener pour le mode sombre
  darkModeToggle.addEventListener('click', toggleDarkMode);

  // Event listener pour le bouton de validation
  validationButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const codePostal = codePostalInput.value.trim();
    const inseeCode = communeSelect.value;
    const days = parseInt(forecastDaysRange.value, 10);
    const selectedOptions = getSelectedOptions();

    if (!codePostal || !inseeCode) {
      showErrorMessage('Veuillez saisir un code postal et sélectionner une commune.');
      return;
    }

    // Afficher un indicateur de chargement
    validationButton.innerHTML = '<div class="loading"></div> Chargement...';
    validationButton.disabled = true;

    const weatherSection = document.getElementById('weatherInformation');
    weatherSection.innerHTML = ''; // Vider la section avant l'affichage

    try {
      // Récupérer les données météo et les coordonnées
      const [meteoData, communeData] = await Promise.all([
        fetchMeteoByCommune(inseeCode, days),
        fetchCommuneCoordinates(inseeCode)
      ]);

      if (!meteoData.forecast || meteoData.forecast.length === 0) {
        weatherSection.innerHTML = '<p>Aucune donnée météo disponible.</p>';
        weatherSection.style.display = 'block';
        return;
      }

      // Sauvegarder dans l'historique
      const communeName = communeSelect.options[communeSelect.selectedIndex].text.split(' (')[0];
      saveToHistory(communeName, inseeCode, days, selectedOptions);

      // Afficher les informations de localisation si demandées
      if ((selectedOptions.latitude || selectedOptions.longitude) && communeData && communeData.centre) {
        const locationDiv = document.createElement('div');
        locationDiv.classList.add('location-info');
        
        let locationHtml = `<h4><i class="fas fa-map-marker-alt"></i> ${communeName}</h4>`;
        
        if (selectedOptions.latitude) {
          locationHtml += `<p><i class="fas fa-globe"></i> Latitude: ${communeData.centre.coordinates[1].toFixed(6)}°</p>`;
        }
        if (selectedOptions.longitude) {
          locationHtml += `<p><i class="fas fa-globe"></i> Longitude: ${communeData.centre.coordinates[0].toFixed(6)}°</p>`;
        }
        
        locationDiv.innerHTML = locationHtml;
        weatherSection.appendChild(locationDiv);
      }

      // Creation dynamique des colonnes par jour
      meteoData.forecast.forEach((dayData, index) => {
        if (index >= days) return;

        const dayBlock = document.createElement('div');
        dayBlock.classList.add('weather-day');

        const dayLabel = getDayLabel(index, dayData.datetime);
        const weatherIcon = getWeatherIcon(dayData.weather);
        const weatherDesc = getWeatherDescription(dayData.weather);

        let dayHtml = `
          <h3>${dayLabel}</h3>
          <div class="weather-icon">
            <i class="${weatherIcon}"></i>
          </div>
          <p style="font-size: 0.9rem; margin-bottom: 15px;">${new Date(dayData.datetime).toLocaleDateString('fr-FR')}</p>
          <div class="temp-display">
            <span class="temp-max">${dayData.tmax}°C</span>
            <span class="temp-min">${dayData.tmin}°C</span>
          </div>
          <p style="margin: 10px 0; font-weight: 500;">${weatherDesc}</p>
          <div class="weather-details">
        `;

        // Ajouter les informations supplémentaires sélectionnées
        if (selectedOptions.rain && dayData.rr1 !== undefined) {
          dayHtml += `<p><i class="fas fa-tint"></i> Pluie: <span>${dayData.rr1} mm</span></p>`;
        }
        
        if (selectedOptions.wind && dayData.wind10m !== undefined) {
          dayHtml += `<p><i class="fas fa-wind"></i> Vent: <span>${dayData.wind10m} km/h</span></p>`;
        }
        
        if (selectedOptions.windDirection && dayData.dirwind10m !== undefined) {
          const windDir = getWindDirection(dayData.dirwind10m);
          dayHtml += `<p><i class="fas fa-compass"></i> Direction: <span>${windDir} (${dayData.dirwind10m}°)</span></p>`;
        }

        // Ajouter des informations supplémentaires toujours présentes
        if (dayData.probarain !== undefined) {
          dayHtml += `<p><i class="fas fa-cloud-rain"></i> Probabilité pluie: <span>${dayData.probarain}%</span></p>`;
        }
        
        if (dayData.sun_hours !== undefined) {
          dayHtml += `<p><i class="fas fa-sun"></i> Ensoleillement: <span>${dayData.sun_hours}h</span></p>`;
        }

        dayHtml += `</div>`;
        dayBlock.innerHTML = dayHtml;
        weatherSection.appendChild(dayBlock);
      });

      weatherSection.style.display = 'flex';

      // Ajouter un bouton de nouvelle recherche
      const reloadButton = document.createElement('button');
      reloadButton.classList.add('reloadButton');
      reloadButton.innerHTML = '<i class="fas fa-redo"></i> Nouvelle recherche';
      reloadButton.addEventListener('click', () => {
        location.reload();
      });
      
      weatherSection.appendChild(reloadButton);

    } catch (error) {
      showErrorMessage(`Erreur lors de la récupération des données météo: ${error.message}`);
    } finally {
      // Restaurer le bouton
      validationButton.innerHTML = '<i class="fas fa-search"></i> Rechercher la météo';
      validationButton.disabled = false;
    }
  });

  // Initialiser l'affichage des jours
  updateDaysDisplay();
});