import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 30000, // 30 seconds timeout for AI predictions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.error || data?.message || `Server error (${status})`;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Get sample data for testing
  async getSampleData() {
    const response = await api.get('/sample-data');
    return response.data;
  },

  // Predict heart disease
  async predictHeartDisease(patientData) {
    const response = await api.post('/predict', patientData);
    return response.data;
  },

  // Get all predictions (for admin/debugging)
  async getAllPredictions() {
    const response = await api.get('/predictions');
    return response.data;
  },
};

// Field definitions for the prediction form
export const fieldDefinitions = {
  age: {
    label: 'Age',
    type: 'number',
    min: 1,
    max: 120,
    required: true,
    description: 'Patient age in years'
  },
  sex: {
    label: 'Sex',
    type: 'select',
    options: [
      { value: 0, label: 'Female' },
      { value: 1, label: 'Male' }
    ],
    required: true,
    description: 'Patient gender'
  },
  cp: {
    label: 'Chest Pain Type',
    type: 'select',
    options: [
      { value: 0, label: 'Typical Angina' },
      { value: 1, label: 'Atypical Angina' },
      { value: 2, label: 'Non-anginal Pain' },
      { value: 3, label: 'Asymptomatic' }
    ],
    required: true,
    description: 'Type of chest pain experienced'
  },
  trestbps: {
    label: 'Resting Blood Pressure',
    type: 'number',
    min: 80,
    max: 250,
    required: true,
    description: 'Resting blood pressure in mm Hg'
  },
  chol: {
    label: 'Cholesterol',
    type: 'number',
    min: 100,
    max: 600,
    required: true,
    description: 'Serum cholesterol in mg/dl'
  },
  fbs: {
    label: 'Fasting Blood Sugar',
    type: 'select',
    options: [
      { value: 0, label: '≤ 120 mg/dl' },
      { value: 1, label: '> 120 mg/dl' }
    ],
    required: true,
    description: 'Fasting blood sugar level'
  },
  restecg: {
    label: 'Resting ECG',
    type: 'select',
    options: [
      { value: 0, label: 'Normal' },
      { value: 1, label: 'ST-T Wave Abnormality' },
      { value: 2, label: 'Left Ventricular Hypertrophy' }
    ],
    required: true,
    description: 'Resting electrocardiographic results'
  },
  thalach: {
    label: 'Maximum Heart Rate',
    type: 'number',
    min: 60,
    max: 220,
    required: true,
    description: 'Maximum heart rate achieved during exercise'
  },
  exang: {
    label: 'Exercise Induced Angina',
    type: 'select',
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' }
    ],
    required: true,
    description: 'Exercise induced angina'
  },
  oldpeak: {
    label: 'ST Depression',
    type: 'number',
    min: 0,
    max: 10,
    step: 0.1,
    required: true,
    description: 'ST depression induced by exercise relative to rest'
  },
  slope: {
    label: 'Slope of Peak Exercise ST Segment',
    type: 'select',
    options: [
      { value: 0, label: 'Upsloping' },
      { value: 1, label: 'Flat' },
      { value: 2, label: 'Downsloping' }
    ],
    required: true,
    description: 'Slope of the peak exercise ST segment'
  },
  ca: {
    label: 'Number of Major Vessels',
    type: 'select',
    options: [
      { value: 0, label: '0' },
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' }
    ],
    required: true,
    description: 'Number of major vessels colored by fluoroscopy'
  },
  thal: {
    label: 'Thalassemia',
    type: 'select',
    options: [
      { value: 0, label: 'Normal' },
      { value: 1, label: 'Fixed Defect' },
      { value: 2, label: 'Reversible Defect' },
      { value: 3, label: 'Unknown' }
    ],
    required: true,
    description: 'Thalassemia type'
  },
  num_drugs: {
    label: 'Number of Recommended Drugs',
    type: 'number',
    min: 1,
    max: 10,
    required: true,
    description: 'Number of drugs to recommend'
  }
};

export default api;
