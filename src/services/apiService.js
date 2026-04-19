import axios from "axios";

const NODE_API_URL = "http://localhost:3001/api/mortgage";
//export base URL for the API
export const BASE_URL = "http://localhost:3001";

/**
 * Fetch mortgage data from Node.js server with progress tracking.
 */
export const fetchMortgageData = async (mortgageType, params, onProgress) => {
  try {
    const config = {
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted); // Call the progress callback
        }
      },
    };

    const response = await axios.post(NODE_API_URL, { mortgageType, params }, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${mortgageType} mortgage data:`, error);
    throw new Error("Failed to fetch mortgage data");
  }
};