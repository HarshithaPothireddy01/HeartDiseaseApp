# Heart Disease Prediction System

A modern, AI-powered heart disease prediction system with a React frontend and Flask backend. This system uses Groq AI to analyze patient data and provide heart disease risk predictions along with personalized drug recommendations.

## 🏗️ Project Structure

```
new_heart/
├── backend/
│   ├── app.py              # Original backend (untouched)
│   ├── app_new.py          # New Flask API backend
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── ...
│   └── package.json       # Node.js dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your actual API keys and MongoDB URI
   ```

5. Start the Flask server:
   ```bash
   python app_new.py
   ```

   The API will be available at `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Health Check
- **GET** `/api/health` - Check API status and database connection

### Prediction
- **POST** `/api/predict` - Get heart disease prediction
- **GET** `/api/sample-data` - Get sample patient data for testing

### Data Management
- **GET** `/api/predictions` - Get all predictions (for debugging)

## 📊 Patient Data Parameters

The system analyzes the following clinical parameters:

| Parameter | Description | Type | Range |
|-----------|-------------|------|-------|
| age | Patient age in years | number | 1-120 |
| sex | Patient gender | select | 0 (Female), 1 (Male) |
| cp | Chest pain type | select | 0-3 (Typical, Atypical, Non-anginal, Asymptomatic) |
| trestbps | Resting blood pressure (mm Hg) | number | 80-250 |
| chol | Serum cholesterol (mg/dl) | number | 100-600 |
| fbs | Fasting blood sugar | select | 0 (≤120), 1 (>120) |
| restecg | Resting ECG results | select | 0-2 (Normal, ST-T, LVH) |
| thalach | Maximum heart rate | number | 60-220 |
| exang | Exercise induced angina | select | 0 (No), 1 (Yes) |
| oldpeak | ST depression | number | 0-10 |
| slope | Peak exercise ST slope | select | 0-2 (Upsloping, Flat, Downsloping) |
| ca | Number of major vessels | select | 0-3 |
| thal | Thalassemia type | select | 0-3 (Normal, Fixed, Reversible, Unknown) |
| num_drugs | Number of drugs to recommend | number | 1-10 |

## 🎯 Features

### Frontend
- **Modern UI**: Clean, responsive design with glassmorphism effects
- **Real-time Validation**: Form validation with helpful error messages
- **Sample Data**: Load sample data for quick testing
- **Results Visualization**: Beautiful charts and risk level indicators
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Backend
- **AI Integration**: Uses Groq AI for accurate predictions
- **Database Support**: MongoDB Atlas integration with local fallback
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin requests enabled for frontend
- **Health Monitoring**: API health check endpoints

## 🔒 Security & Privacy

- **API Keys**: All sensitive credentials are stored in `.env` file (not committed to version control)
- **Environment Variables**: Use `.env.example` as a template for your own `.env` file
- **Patient Data**: Processed securely with no sensitive data stored in frontend
- **CORS**: Properly configured for secure communication
- **Gitignore**: `.env` files are excluded from version control

### Environment Variables Setup

1. Copy the example file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env` with your actual credentials:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   ```

## 🧪 Testing

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test with sample data
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 43, "sex": 0, "cp": 3, "trestbps": 120, "chol": 239, "fbs": 1, "restecg": 1, "thalach": 152, "exang": 0, "oldpeak": 0.8, "slope": 1, "ca": 0, "thal": 3, "num_drugs": 5}'
```

### Frontend Testing
1. Open `http://localhost:3000`
2. Click "Start Prediction"
3. Fill the form or click "Load Sample Data"
4. Submit to see results

## 🚨 Troubleshooting

### Backend Issues
- **MongoDB Connection**: Check internet connection and MongoDB Atlas credentials in `.env` file
- **Groq API**: Verify API key is valid and has sufficient credits in `.env` file
- **Port Conflicts**: Ensure port 5001 is available (5000 is used by macOS AirPlay)
- **Environment Variables**: Make sure `.env` file exists and contains valid credentials

### Frontend Issues
- **API Connection**: Ensure backend is running on port 5001
- **Build Errors**: Clear node_modules and reinstall dependencies
- **CORS Errors**: Check that Flask-CORS is properly configured

## 📝 Development Notes

- The original `app.py` remains completely untouched
- The new `app_new.py` provides the same functionality via REST API
- Frontend and backend are completely independent
- All communication happens through well-defined API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and research purposes. Please ensure compliance with medical data regulations in your jurisdiction.

---

**Note**: This system is for educational purposes only and should not be used as a substitute for professional medical advice.
