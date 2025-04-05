import axios from 'axios';

const API_BASE_URL = '/api/feedback'; // Adjust the base URL as per your API structure

// Fetch all feedback
export const fetchFeedback = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

// Submit new feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(API_BASE_URL, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Upvote feedback
export const upvoteFeedback = async (feedbackId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${feedbackId}/upvote`);
    return response.data;
  } catch (error) {
    console.error('Error upvoting feedback:', error);
    throw error;
  }
};

// Edit feedback
export const editFeedback = async (feedbackId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${feedbackId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error editing feedback:', error);
    throw error;
  }
};

// Delete feedback
export const deleteFeedback = async (feedbackId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${feedbackId}`);
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};