/**
 * Utility functions for handling API errors consistently across the application
 */

/**
 * Extracts error message from API response, particularly for 429 status codes
 * @param response - The fetch response object
 * @returns Promise<string> - The error message from the API or a fallback message
 */
export const getApiErrorMessage = async (response: Response): Promise<string> => {
  try {
    const responseData = await response.json();
    // For 429 status code or any other error, try to extract the error message from the response
    if (responseData && responseData.error) {
      return responseData.error;
    }
    // Fallback to status text or generic message
    return response.statusText || `HTTP error! status: ${response.status}`;
  } catch (jsonError) {
    // If we can't parse JSON, return a generic message
    return response.statusText || `HTTP error! status: ${response.status}`;
  }
};

/**
 * Handles API response errors and throws an error with appropriate message
 * @param response - The fetch response object
 * @throws Error with API error message or fallback message
 */
export const handleApiError = async (response: Response): Promise<void> => {
  if (!response.ok) {
    const errorMessage = await getApiErrorMessage(response);
    throw new Error(errorMessage);
  }
};
