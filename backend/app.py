from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from datetime import datetime, timezone
from groq import Groq
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# -------------------------------
# MongoDB Setup
# -------------------------------
MONGO_URI = os.getenv("MONGO_URI")

def connect_to_mongodb():
    """Try to connect to MongoDB with multiple methods"""
    
    methods = [
        ("tlsInsecure=True", {"tlsInsecure": True}),
        ("tlsAllowInvalidCertificates=True", {"tlsAllowInvalidCertificates": True}),
        ("Using certifi", {"tlsCAFile": None}),  # Will set below if certifi available
    ]
    
    # Try with certifi if available
    try:
        import certifi
        methods[2] = ("Using certifi", {"tlsCAFile": certifi.where()})
    except ImportError:
        pass
    
    for i, (method_name, params) in enumerate(methods, 1):
        print(f"🔄 Method {i}: {method_name}...")
        try:
            client = MongoClient(
                MONGO_URI,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                **params
            )
            # Test connection
            client.admin.command('ping')
            print(f"✅ Connected successfully with {method_name}!\n")
            return client, None
        except Exception as e:
            error_msg = str(e)[:120]
            print(f"❌ Failed: {error_msg}")
            continue
    
    return None, "All connection methods failed"

# Initialize MongoDB connection
print("="*70)
print("CONNECTING TO MONGODB ATLAS")
print("="*70 + "\n")

client, error = connect_to_mongodb()

if client:
    db = client["heart_disease_db"]
    collection = db["user_predictions"]
    use_local_storage = False
    print(f"✅ Using MongoDB: {db.name}")
else:
    print(f"\n⚠️  MongoDB Connection Failed: {error}")
    print("📁 Falling back to LOCAL JSON STORAGE\n")
    use_local_storage = True
    LOCAL_STORAGE_FILE = "predictions_storage.json"

# -------------------------------
# Groq Setup
# -------------------------------
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# -------------------------------
# API Routes
# -------------------------------

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Heart Disease Prediction API is running",
        "database": "MongoDB" if not use_local_storage else "Local JSON",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict_heart_disease():
    """Main prediction endpoint"""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract patient data and number of drugs
        k = data.get("num_drugs", 5)
        patient_data = {key: value for key, value in data.items() if key != "num_drugs"}
        
        # Validate required fields
        required_fields = [
            "age", "sex", "cp", "trestbps", "chol", "fbs", 
            "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ]
        
        missing_fields = [field for field in required_fields if field not in patient_data]
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        print(f"📋 Processing prediction for patient data: {patient_data}")
        print(f"🔹 Requesting {k} recommended drugs")
        
        # -------------------------------
        # Groq API Call
        # -------------------------------
        prompt = f"""
        You are a clinical AI assistant. Based on the following patient data, provide:
        1. Probability of having heart disease (0-1 range)
        2. Top-{k} recommended drugs for treatment/prevention

        Patient data: {patient_data}

        Return ONLY valid JSON without markdown code blocks.
        Format:
        {{
          "probability_of_heart_disease": 0.XX,
          "recommended_drugs": ["Drug1", "Drug2", ...]
        }}
        """

        print("\n🔹 Sending data to Groq AI...\n")

        completion = groq_client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        prediction_json = completion.choices[0].message.content.strip()
        
        # Clean markdown
        if "```json" in prediction_json:
            prediction_json = prediction_json.split("```json")[1].split("```")[0].strip()
        elif "```" in prediction_json:
            prediction_json = prediction_json.split("```")[1].split("```")[0].strip()

        print("✅ Groq API Response:")
        print(prediction_json)
        
        try:
            prediction = json.loads(prediction_json)
            print("\n✅ JSON parsed successfully\n")
        except json.JSONDecodeError as e:
            print(f"\n⚠️  JSON parsing error: {e}")
            prediction = {"raw_output": prediction_json}

        # -------------------------------
        # Save Data
        # -------------------------------
        record = {
            "inputs": patient_data,
            "num_drugs_requested": k,
            "prediction": prediction,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "model_used": "openai/gpt-oss-20b"
        }

        print("="*70)
        
        if use_local_storage:
            # Save to local JSON file
            try:
                if os.path.exists(LOCAL_STORAGE_FILE):
                    with open(LOCAL_STORAGE_FILE, 'r') as f:
                        storage = json.load(f)
                else:
                    storage = {"predictions": []}
                
                storage["predictions"].append(record)
                
                with open(LOCAL_STORAGE_FILE, 'w') as f:
                    json.dump(storage, f, indent=2)
                
                print("✅ SUCCESS - SAVED TO LOCAL FILE")
                print("="*70)
                print(f"   File: {LOCAL_STORAGE_FILE}")
                print(f"   Total predictions: {len(storage['predictions'])}")
                print(f"   Probability: {prediction.get('probability_of_heart_disease', 'N/A')}")
                drugs = prediction.get('recommended_drugs', [])
                print(f"   Drugs: {len(drugs)} - {', '.join(drugs[:3])}...")
            except Exception as e:
                print(f"❌ Local storage error: {e}")
                return jsonify({"error": "Failed to save prediction"}), 500
        
        else:
            # Save to MongoDB
            try:
                result = collection.insert_one(record)
                print("✅ SUCCESS - SAVED TO MONGODB")
                print("="*70)
                print(f"   Database: {db.name}")
                print(f"   Collection: {collection.name}")
                print(f"   Document ID: {result.inserted_id}")
                print(f"   Probability: {prediction.get('probability_of_heart_disease', 'N/A')}")
                drugs = prediction.get('recommended_drugs', [])
                print(f"   Drugs: {len(drugs)} - {', '.join(drugs[:3])}...")
            except Exception as e:
                print(f"❌ MongoDB save error: {e}")
                return jsonify({"error": "Failed to save prediction"}), 500
        
        print("="*70)

        # Return prediction result
        return jsonify({
            "success": True,
            "prediction": prediction,
            "patient_data": patient_data,
            "num_drugs_requested": k,
            "timestamp": record["created_at"],
            "model_used": record["model_used"]
        })

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    """Get all predictions (for debugging/admin purposes)"""
    try:
        if use_local_storage:
            if os.path.exists(LOCAL_STORAGE_FILE):
                with open(LOCAL_STORAGE_FILE, 'r') as f:
                    storage = json.load(f)
                return jsonify({
                    "success": True,
                    "predictions": storage.get("predictions", []),
                    "total": len(storage.get("predictions", []))
                })
            else:
                return jsonify({
                    "success": True,
                    "predictions": [],
                    "total": 0
                })
        else:
            predictions = list(collection.find({}, {"_id": 0}))
            return jsonify({
                "success": True,
                "predictions": predictions,
                "total": len(predictions)
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sample-data', methods=['GET'])
def get_sample_data():
    """Get sample patient data for testing"""
    sample_data = {
        "age": 43,
        "sex": 0,
        "cp": 3,
        "trestbps": 120,
        "chol": 239,
        "fbs": 1,
        "restecg": 1,
        "thalach": 152,
        "exang": 0,
        "oldpeak": 0.8,
        "slope": 1,
        "ca": 0,
        "thal": 3,
        "num_drugs": 5
    }
    return jsonify({
        "success": True,
        "sample_data": sample_data,
        "description": "Sample patient data for heart disease prediction"
    })

if __name__ == '__main__':
    import os
    
    print("\n" + "="*70)
    print("HEART DISEASE PREDICTION API STARTING")
    print("="*70)
    print("🚀 Server starting on Render")
    print("📋 Available endpoints:")
    print("   GET  /api/health - Health check")
    print("   POST /api/predict - Heart disease prediction")
    print("   GET  /api/predictions - Get all predictions")
    print("   GET  /api/sample-data - Get sample data")
    print("="*70 + "\n")
    
    # ✅ Use dynamic port assigned by Render
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=False, host='0.0.0.0', port=port)

