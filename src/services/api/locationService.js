import axios from 'axios'

const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY
const BASE_URL = 'https://us1.locationiq.com/v1'

/**
 * Service pour les opérations liées à la géolocalisation et aux itinéraires.
 * LocationIQ utilise OpenStreetMap pour des données économiques et fiables.
 */
export const locationService = {
  /**
   * Récupère une adresse à partir de coordonnées GPS.
   */
  async reverseGeocode(lat, lon) {
    try {
      const response = await axios.get(`${BASE_URL}/reverse`, {
        params: {
          key: API_KEY,
          lat,
          lon,
          format: 'json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Erreur reverse geocoding:', error)
      return null
    }
  },

  /**
   * Recherche d'adresses ou de lieux (Autocomplétion).
   */
  async search(query) {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          key: API_KEY,
          q: query,
          format: 'json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Erreur recherche adresse:', error)
      return []
    }
  },

  /**
   * Calcul d'un itinéraire entre deux points.
   * Retourne une lise de coordonnées [lat, lon] prêtes pour Leaflet.
   */
  async getRoute(latFrom, lonFrom, latTo, lonTo) {
    try {
      const response = await axios.get(`https://us1.locationiq.com/v1/directions/driving/${lonFrom},${latFrom};${lonTo},${latTo}`, {
        params: {
          key: API_KEY,
          overview: 'full',
          geometries: 'polyline',
        },
      })
      
      const route = response.data.routes[0]
      if (!route) return null

      // Décodage sommaire de la polyline (Algorithme Polyline Google/OSM)
      // Note: Pour une implémentation robuste, on pourrait utiliser '@mapbox/polyline'
      return {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry // C'est une chaîne encodée
      }
    } catch (error) {
      console.error('Erreur itinéraire:', error)
      return null
    }
  }
}

/**
 * Fonction de décodage de polyline LocationIQ/OSRM
 */
export function decodePolyline(str, precision = 5) {
  let index = 0,
      lat = 0,
      lng = 0,
      coordinates = [],
      shift = 0,
      result = 0,
      byte = null,
      latitude_change,
      longitude_change,
      factor = Math.pow(10, precision);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += latitude_change;

    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += longitude_change;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
}
