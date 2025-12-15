import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const findRoute = async (origin, destination) => {
    try {
        const response = await axios.get(`${API_URL}/routes/fastest`, {
            params: { origin, destination }
        });
        return response.data;
    } catch (error) {
        console.error("Error finding route:", error);
        throw error;
    }
};

export const checkWordExists = async (word) => {
    try {
        const response = await axios.get(`${API_URL}/words/${word}/exists`);
        return response.data;
    } catch (error) {
        console.error("Error checking word:", error);
        return false;
    }
};

export const getGraphStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/graph/stats`);
        return response.data;
    } catch (error) {
        console.error("Error getting stats:", error);
        throw error;
    }
};
