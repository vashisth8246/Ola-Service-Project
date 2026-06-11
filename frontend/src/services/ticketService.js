import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const ticketService = {
  async getAllTickets() {
    const response = await axios.get(`${API_BASE_URL}/tickets`);
    return response.data;
  },

  async getTicketById(id) {
    const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
    return response.data;
  },

  async createTicket(ticketData) {
    const response = await axios.post(`${API_BASE_URL}/tickets`, ticketData);
    return response.data;
  }
};