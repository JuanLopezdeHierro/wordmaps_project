import axios from 'axios';

// Production API URL
const API_URL = 'https://e23y9088lc.execute-api.us-east-1.amazonaws.com/api';

export const findRoute = async (origin, destination) => {
    try {
        const response = await axios.get(`${API_URL}/routes/fastest`, {
            params: { origin, destination }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkWordExists = async (word) => {
    try {
        const response = await axios.get(`${API_URL}/words/${word}/exists`);
        return response.data;
    } catch (error) {
        return false;
    }
};

export const getGraphStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/graph/stats`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTopConnected = async () => {
    try {
        const response = await axios.get(`${API_URL}/graph/top-connected?limit=10`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getIsolated = async () => {
    try {
        const response = await axios.get(`${API_URL}/graph/isolated`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getNeighbors = async (word) => {
    try {
        const response = await axios.get(`${API_URL}/words/${word}/neighbors`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchWords = async (pattern) => {
    try {
        const response = await axios.get(`${API_URL}/words/search`, {
            params: { pattern }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
