# 🎵 Moodify - Emotion-Based Music Recommendation System

An intelligent AI-powered application that detects your emotions through multiple modalities (text, speech, and facial expressions) and recommends personalized music to match or enhance your mood using Spotify integration.

## 🌟 Features

- **Multi-Modal Emotion Detection**
  - 📝 Text emotion analysis using BERT and transformer models
  - 🎤 Speech emotion recognition from audio input
  - 😊 Facial expression analysis using CNN models
- **Intelligent Music Recommendations**
  - Real-time music suggestions via Spotify API
  - Mood-based playlist generation
  - Personalized recommendations based on emotion history
- **User Experience**
  - User authentication and profile management
  - Mood history tracking and analytics
  - Dark mode theme support
  - Responsive web interface
  - Mobile app support (React Native)
- **Cloud & DevOps**
  - Docker containerization for all services
  - Kubernetes deployment configurations
  - CI/CD pipeline with Jenkins and GitHub Actions
  - Infrastructure as Code (Terraform for AWS & GCP)
  - Data analytics with Spark and Hadoop

## 🚀 Live Demo

**Frontend:** https://moodify-app.vercel.app  
**Backend API:** https://moodify-emotion-music-app.onrender.com

## 🛠️ Tech Stack

### Frontend (Web)
- **Framework:** React 18.3.1
- **UI Library:** Material-UI (MUI) 6.1.1 with @emotion/react & @emotion/styled
- **Routing:** React Router DOM 6.26.2
- **HTTP Client:** Axios 1.7.7
- **Media Processing:** 
  - FFmpeg (@ffmpeg/ffmpeg 0.12.10, @ffmpeg/core 0.12.6)
  - React Webcam 7.2.0
  - React Media Recorder 1.7.1
  - Recorder.js 1.0.7
- **UI Components:** 
  - React Material UI Carousel 3.4.2
  - React Slick 0.30.2
  - Slick Carousel 1.8.1
- **Authentication:** JWT Decode 4.0.0
- **Testing:** Jest 27.5.1, React Testing Library 16.3.0
- **Build Tool:** React Scripts 5.0.1

### Mobile App
- **Framework:** React Native 0.74.5
- **Platform:** Expo ~51.0.28
- **Runtime:** @expo/metro-runtime 3.2.3
- **UI:** React Native Web 0.19.10
- **Core:** React 18.2.0

### Backend
- **Framework:** Django 5.1.1
- **API Framework:** Django REST Framework 3.15.2
- **Database ORM:** 
  - MongoEngine 0.29.1 (MongoDB)
  - Django ORM (SQLite for authentication)
- **Authentication:** 
  - JWT (djangorestframework-simplejwt 5.3.1)
  - Django Allauth 65.0.1
  - dj-rest-auth 6.0.0
- **API Documentation:** drf-yasg 1.21.7 (Swagger/OpenAPI)
- **CORS:** django-cors-headers 4.4.0
- **Middleware:** WhiteNoise 6.7.0
- **Environment:** python-decouple 3.8, python-dotenv 1.0.1
- **Server:** Gunicorn 23.0.0

### AI/ML Services
- **Deep Learning Frameworks:**
  - PyTorch 2.2.2 (TorchVision 0.17.2, TorchAudio 2.2.2)
  - TensorFlow 2.17.0 (TF-Keras 2.17.0)
  - Keras 3.5.0
- **NLP & Transformers:**
  - Transformers 4.44.2 (Hugging Face)
  - Tokenizers 0.19.1
  - Datasets 3.0.0
- **Computer Vision:**
  - OpenCV (opencv-python 4.10.0.84, opencv-contrib-python 4.10.0.84)
  - FaceNet PyTorch 2.6.0
  - FER (Facial Expression Recognition) 22.5.1
  - Pillow 10.2.0
  - ImageIO 2.35.1
- **Audio Processing:**
  - Librosa 0.10.2
  - SoundFile 0.12.1
  - PySoundFile 0.9.0
  - Resampy 0.4.3
  - AudioRead 3.0.1
- **Machine Learning:**
  - Scikit-learn 1.5.2
  - Scipy 1.14.1
  - NumPy 1.26.4
  - Pandas 2.2.3
  - Joblib 1.4.2
- **Model Optimization:**
  - Accelerate 0.34.2
  - SafeTensors 0.4.5
- **Monitoring:** TensorBoard 2.17.1

### Data Processing & Analytics
- **Big Data:** Apache Spark (PySpark 3.5.3)
- **Database:** MongoDB (PyMongo 4.9.1), MongoEngine 0.29.1
- **Caching:** Redis 5.0.8
- **Data Manipulation:** Pandas 2.2.3, NumPy 1.26.4, PyArrow 17.0.0
- **Visualization:** Matplotlib 3.9.2, Seaborn (via dependencies)

### API Integrations
- **Music Service:** Spotipy 2.24.0 (Spotify Web API)
- **HTTP Requests:** Requests 2.32.3, HTTPX 0.27.2, AIOHTTP 3.10.5

### DevOps & Infrastructure
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes
- **Cloud Platforms:** AWS, Google Cloud Platform (GCP)
- **Infrastructure as Code:** Terraform
- **CI/CD:** 
  - Jenkins (Jenkinsfile)
  - GitHub Actions (.github/workflows)
- **Web Server:** Nginx
- **Process Management:** Gunicorn 23.0.0

### Development Tools
- **Notebook:** Jupyter Lab 4.2.5, Jupyter Notebook 7.2.2
- **Testing:** 
  - Pytest 8.4.1
  - Pytest-Django 4.11.1
  - Jest 27.5.1 (Frontend)
- **Code Quality:** Prettier 3.3.3
- **Package Management:** 
  - npm/npx (Frontend)
  - pip (Backend/AI)
- **Version Control:** Git, GitHub

### System Requirements
- **Python:** 3.8+ (for AI/ML: TensorFlow, PyTorch, Transformers)
- **Node.js:** 14.x+ with npm 6.x+
- **Databases:** MongoDB 4.4+, SQLite 3
- **Operating Systems:** Cross-platform (Linux, macOS, Windows)

## 📋 Prerequisites

- **Python:** 3.8 or higher
- **Node.js:** 14.x or higher
- **npm:** 6.x or higher
- **MongoDB:** 4.4+ (or MongoDB Atlas account)
- **Docker & Docker Compose:** (optional, for containerized deployment)
- **Spotify Developer Account:** For music recommendation API

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/shubhamrajput27/Moodify.git
cd Moodify
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
SECRET_KEY=your-django-secret-key
MONGO_DB_URI=mongodb://localhost:27017/moodify
MONGO_DB_USERNAME=your-mongodb-username
MONGO_DB_PASSWORD=your-mongodb-password
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

### 3. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r ../requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```
Backend will run on: `http://localhost:8000`

### 4. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start React development server
npm start
```
Frontend will run on: `http://localhost:3000`

### 5. AI/ML Service (Optional)
```bash
cd ai_ml

# Install dependencies
pip install -r ../requirements.txt

# Download pre-trained models
python download_models.py

# Start Flask AI service
python app.py
```
AI service will run on: `http://localhost:5000`

## 🐳 Docker Deployment

Run all services with Docker Compose:

```bash
# Start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

Services will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- AI/ML Service: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## 📱 Mobile App

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📚 API Documentation

Once the backend is running, access the API documentation:

- **Swagger UI:** `http://localhost:8000/swagger/`
- **ReDoc:** `http://localhost:8000/redoc/`
- **OpenAPI Spec:** `openapi.yaml`

### Key API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/emotion/text/` - Analyze text emotion
- `POST /api/emotion/speech/` - Analyze speech emotion
- `POST /api/emotion/facial/` - Analyze facial emotion
- `GET /api/recommendations/` - Get music recommendations
- `GET /api/user/history/` - Get emotion history

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
pytest
# Or with coverage
pytest --cov=. --cov-report=html
```

### Frontend Tests
```bash
cd frontend
npm test
# Coverage report
npm run test:coverage
```

## 📊 Data Analytics

The project includes Spark-based analytics for emotion patterns and recommendations:

```bash
cd data_analytics
python main.py
```

## ☸️ Kubernetes Deployment

```bash
# Apply Kubernetes configurations
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods
kubectl get services
```

## 🏗️ Project Structure

```
Moodify/
├── ai_ml/              # AI/ML models and services
├── backend/            # Django REST API
├── frontend/           # React web application
├── mobile/             # React Native mobile app
├── data_analytics/     # Spark analytics
├── kubernetes/         # K8s deployment configs
├── aws/                # AWS infrastructure (Terraform)
├── gcp/                # GCP infrastructure (Terraform)
├── nginx/              # Nginx configuration
├── .github/            # GitHub Actions CI/CD
├── docker-compose.yml  # Docker orchestration
├── Jenkinsfile         # Jenkins pipeline
└── requirements.txt    # Python dependencies
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shubham Rajput**
- GitHub: [@shubhamrajput27](https://github.com/shubhamrajput27)
- Repository: [Moodify](https://github.com/shubhamrajput27/Moodify)

## 🙏 Acknowledgments

- Spotify API for music recommendations
- Pre-trained emotion detection models
- Open-source community

---

© 2025 Shubham Rajput. Made with ❤️ for better emotional well-being through music.
