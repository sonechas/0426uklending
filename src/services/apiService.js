import axios from "axios";

const NODE_API_URL = "/api/mortgage";
export const BASE_URL = window.location.origin;

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
    const errorMsg = error.response?.data?.error || "Failed to fetch mortgage data";
    console.error(`Error fetching ${mortgageType} mortgage data:`, error);
    throw new Error(errorMsg);
  }
};