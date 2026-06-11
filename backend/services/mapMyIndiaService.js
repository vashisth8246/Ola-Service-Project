const axios = require('axios');

class MapMyIndiaService {
  constructor() {
    this.baseURL = 'https://apis.mapmyindia.com/advancedmaps/v1';
    this.apiKey = process.env.MAPMYINDIA_API_KEY || 'aebcfeb032e0330f7996bd05ea4b7833';
    this.clientId = process.env.MAPMYINDIA_CLIENT_ID || '96dHZVzsAuuqNmA1oNtVr_vpFvhnXZJZrNYA';
    this.clientSecret = process.env.MAPMYINDIA_CLIENT_SECRET || 'lrFxI-iSEg-HWm5G-lCJHXGL19inFEX32jzB108';
  }

  // Geocoding - Convert address to coordinates
  async geocode(address) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.apiKey}/geo_code?addr=${encodeURIComponent(address)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

  // Reverse Geocoding - Convert coordinates to address
  async reverseGeocode(lat, lng) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.apiKey}/rev_geocode?lat=${lat}&lng=${lng}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Reverse geocoding failed: ${error.message}`);
    }
  }

  // Get directions between two points
  async getDirections(start, end) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.apiKey}/route_adv/driving/${start};${end}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Directions failed: ${error.message}`);
    }
  }

  // Find nearby places
  async findNearby(lat, lng, keywords = 'service center', radius = 1000) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.apiKey}/nearby/json?keywords=${keywords}&refLocation=${lat},${lng}&radius=${radius}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Nearby search failed: ${error.message}`);
    }
  }

  // Auto-suggest for places
  async autoSuggest(query) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.apiKey}/autosuggest?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Auto-suggest failed: ${error.message}`);
    }
  }

  // Distance matrix for multiple origins/destinations
  async getDistanceMatrix(origins, destinations) {
    try {
      const response = await axios.get(
        `${this.baseURL}/${this.apiKey}/distance_matrix/driving/${origins}/${destinations}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Distance matrix failed: ${error.message}`);
    }
  }
}

module.exports = new MapMyIndiaService();