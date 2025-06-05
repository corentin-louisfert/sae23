# Projet Web : Instant Weather V2

## Description du Projet

Instant Weather V2 est une application web de météorologie permettant de consulter les prévisions météo détaillées pour toutes les communes françaises, sur une période configurable de 1 à 7 jours. Le projet met l’accent sur la personnalisation de l’affichage des données météo, l’ergonomie de navigation et l’accessibilité. Il s’adresse à tout utilisateur souhaitant obtenir des informations météorologiques précises et rapidement accessibles.

## Structure du Projet

Le projet est organisé autour d'une page principale interactive développée avec les technologies web standards. Les fonctionnalités s’appuient sur des APIs publiques pour récupérer et afficher les données en temps réel.

### Fichiers principaux :

- `index.html` : Page principale de l'application avec interface de recherche, affichage des prévisions et options d’affichage.
- `style.css` : Fichier CSS principal pour la mise en forme, incluant les styles pour le mode clair/sombre et etc.
- `app.js` : Fichier JavaScript contenant la logique applicative, la gestion des appels API, la géolocalisation, l’historique, et la dynamique de l’interface.
- `weatherCard.js` : Fichier JavaScript pour faire les carte de météo avec toutes les informations dessus.

## Détail des Fonctionnalités

### Fonctionnalités principales

- **Recherche par code postal** : Saisie d'un code postal français avec sélection automatique des communes correspondantes.
- **Prévisions modulables** : Choix du nombre de jours (1 à 7) via un slider interactif.
- **Affichage personnalisable des données météo** :
  - Coordonnées GPS (latitude / longitude)
  - Cumul de pluie (en millimètres)
  - Vent moyen (en km/h)
  - Direction du vent (en degrés)

### Fonctionnalités avancées

- **Mode sombre** : Basculement automatique du thème selon les préférences de l’utilisateur avec sauvegarde.
- **Géolocalisation** : Détection automatique de la position de l’utilisateur pour affichage local instantané.
- **Historique des recherches** : Conservation des dernières consultations via `localStorage`.
- **Responsive design** : Adaptation automatique à tous les écrans (ordinateur, tablette, mobile).

## Technologies Utilisées

- **Langages** : HTML5, CSS3, JavaScript (ES6+)
- **APIs** :
  - API Météo Concept : pour récupérer les données météorologiques en temps réel.
  - API Geo Gouv : pour obtenir la liste des communes françaises à partir des codes postaux.
- **Outils de développement** :
  - Visual Studio Code
  - Git / GitHub pour le versionnage et l'hébergement

## Design et Accessibilité

- Charte graphique moderne avec dégradés, animations CSS et transitions.
- Accessibilité conforme à la norme WCAG AA 2.0 :
  - Contrastes adaptés
  - Navigation au clavier
  - Balises `aria-label` pour lecteurs d’écran
- Code HTML et CSS validé selon les standards W3C.

## Auteur

Corentin Louisfert, SAE 23 mettre en place une solution informatique
