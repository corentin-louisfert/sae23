// Sélection des éléments
const codePostalInput = document.getElementById("code-postal");
const communeSelect = document.getElementById("communeSelect");
const validationButton = document.getElementById("validationButton");

// Fonction pour effectuer la requête API des communes en utilisant le code postal
async function fetchCommunesByCodePostal(codePostal) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
    );
    const data = await response.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Fonction pour afficher les communes dans la liste déroulante
function displayCommunes(data) {
  communeSelect.innerHTML = "";
  // S'il y a au moins une commune retournée dans data
  if (data.length) {
    data.forEach((commune) => {
      const option = document.createElement("option");
      option.value = commune.code;
      option.textContent = commune.nom;
      communeSelect.appendChild(option);
    });
    communeSelect.style.display = "block";
    validationButton.style.display = "block";
  } else {
    // Supprimer un message précédent s’il existe déjà
    const existingMessage = document.getElementById("error-message");
    if (!existingMessage) {
      const message = document.createElement("p");
      message.id = "error-message";
      message.textContent = "Le code postal saisi n'est pas valide";
      message.classList.add('errorMessage');
      document.body.appendChild(message);
    }

    // Masquer les éléments inutiles
    communeSelect.style.display = "none";
    validationButton.style.display = "none";

    // Recharger la page après 3 secondes
    setTimeout(() => location.reload(), 3000);
  }
}

// Fonction pour effectuer la requête API de météo en utilisant le code de la commune sélectionnée
async function fetchMeteoByCommune(selectedCommune, days) {
  try {
    const apiKey = '58d953c270b7a398a37aa7195765fe7778969c7a1c49c04879cf5230fdc13f74';
    const response = await fetch(
      `https://api.meteo-concept.com/api/forecast/daily?token=${apiKey}&insee=${selectedCommune}&start=0&days=${days}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Fonction pour obtenir le label du jour
function getDayLabel(index, dateString) {
  if (index === 0) return "Aujourd’hui";
  if (index === 1) return "Demain";

  const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const date = new Date(dateString);
  return jours[date.getDay()];
}

document.addEventListener('DOMContentLoaded', () => {
  const postalInput = document.getElementById('code-postal');
  const communeSelect = document.getElementById('communeSelect');
  const forecastDaysSelect = document.getElementById('forecastDays');
  const validationButton = document.getElementById('validationButton');
  const weatherSection = document.getElementById('weatherInformation');

  // Affiche ou masque le bouton Valider selon la présence d'un code postal valide
  postalInput.addEventListener('input', async () => {
    const codePostal = postalInput.value.trim();
    communeSelect.style.display = "none";
    validationButton.style.display = "none";

    if (/^\d{5}$/.test(codePostal)) {
      try {
        const data = await fetchCommunesByCodePostal(codePostal);
        displayCommunes(data);
      } catch (error) {
        console.error(
          "Une erreur est survenue lors de la recherche de la commune :",
          error
        );
        throw error;
      }
    }
  });

  validationButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const codePostal = postalInput.value.trim();
    const inseeCode = communeSelect.value;
    const days = parseInt(forecastDaysSelect.value, 10);

    if (!codePostal || !inseeCode) {
      alert('Veuillez saisir un code postal et sélectionner une commune.');
      return;
    }

    weatherSection.innerHTML = ''; // Vide la section avant l'affichage

    try {
      const data = await fetchMeteoByCommune(inseeCode, days);

      if (!data.forecast || data.forecast.length === 0) {
        weatherSection.innerHTML = '<p>Aucune donnée météo disponible.</p>';
        weatherSection.style.display = 'block';
        return;
      }

      // Création dynamique des colonnes par jour
      data.forecast.forEach((dayData, index) => {
        if (index >= days) return; // Ne dépasse pas le nombre de jours demandé

        const dayBlock = document.createElement('div');
        dayBlock.classList.add('weather-day');

        const dayLabel = getDayLabel(index, dayData.datetime);

        dayBlock.innerHTML = `
          <h3>Jour ${index + 1} - ${dayLabel} (${new Date(dayData.datetime).toLocaleDateString('fr-FR')})</h3>
          <p>Température max : ${dayData.tmax}°C</p>
          <p>Température min : ${dayData.tmin}°C</p>
          <p>Temps : ${dayData.weather}</p>
        `;

        weatherSection.appendChild(dayBlock);
      });

      weatherSection.style.display = 'flex';

    } catch (error) {
      weatherSection.innerHTML = `<p class="errorMessage">Erreur lors de la récupération des données météo : ${error.message}</p>`;
      weatherSection.style.display = 'block';
    }
  });
});
