from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
import requests
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .models import EmotionLog, MusicRecommendation


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        
        # Format error messages properly
        error_message = 'Registration failed. '
        for field, errors in serializer.errors.items():
            error_message += f"{field}: {', '.join(errors)}. "
        
        return Response({'error': error_message.strip()}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'token': str(refresh.access_token),
                    'refresh': str(refresh),
                })
            
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class TextEmotionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        text = request.data.get('text')
        if not text:
            return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Call AI service for text emotion detection
            response = requests.post(
                f"{settings.AI_SERVICE_URL}/text_emotion",
                json={'text': text},
                timeout=30
            )
            response.raise_for_status()
            emotion_data = response.json()
            
            # Log the emotion
            EmotionLog.objects.create(
                user=request.user,
                emotion_type='text',
                detected_emotion=emotion_data['emotion']
            )
            
            return Response(emotion_data)
        
        except requests.exceptions.RequestException as e:
            return Response(
                {'error': f'AI service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class FacialEmotionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        
        try:
            # Call AI service for facial emotion detection
            files = {'image': image_file}
            response = requests.post(
                f"{settings.AI_SERVICE_URL}/facial_emotion",
                files=files,
                timeout=30
            )
            response.raise_for_status()
            emotion_data = response.json()
            
            # Log the emotion
            EmotionLog.objects.create(
                user=request.user,
                emotion_type='facial',
                detected_emotion=emotion_data['emotion']
            )
            
            return Response(emotion_data)
        
        except requests.exceptions.RequestException as e:
            return Response(
                {'error': f'AI service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class SpeechEmotionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if 'audio' not in request.FILES:
            return Response({'error': 'Audio file is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        audio_file = request.FILES['audio']
        
        try:
            # Call AI service for speech emotion detection
            files = {'audio': audio_file}
            response = requests.post(
                f"{settings.AI_SERVICE_URL}/speech_emotion",
                files=files,
                timeout=30
            )
            response.raise_for_status()
            emotion_data = response.json()
            
            # Log the emotion
            EmotionLog.objects.create(
                user=request.user,
                emotion_type='speech',
                detected_emotion=emotion_data['emotion']
            )
            
            return Response(emotion_data)
        
        except requests.exceptions.RequestException as e:
            return Response(
                {'error': f'AI service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class MusicRecommendationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user's recent music recommendations"""
        recommendations = MusicRecommendation.objects.filter(user=request.user)[:20]
        return Response({
            'recommendations': [
                {
                    'name': rec.name,
                    'artist': rec.artist,
                    'album': rec.album,
                    'emotion': rec.emotion,
                    'created_at': rec.created_at,
                } for rec in recommendations
            ]
        })
    
    def post(self, request):
        emotion = request.data.get('emotion')
        if not emotion:
            return Response({'error': 'Emotion is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Emotion to genre mapping
            emotion_genre_map = {
                'happy': ['pop', 'dance', 'party'],
                'sad': ['acoustic', 'sad', 'piano'],
                'angry': ['rock', 'metal', 'hard-rock'],
                'neutral': ['indie', 'alternative', 'chill'],
                'fear': ['ambient', 'dark', 'electronic'],
                'surprise': ['electronic', 'edm', 'dance'],
                'disgust': ['grunge', 'punk', 'alternative'],
            }
            
            # Get genres for the emotion (default to 'indie' if emotion not found)
            genres = emotion_genre_map.get(emotion.lower(), ['indie', 'pop'])
            
            # Initialize Spotify client
            if not settings.SPOTIFY_CLIENT_ID or not settings.SPOTIFY_CLIENT_SECRET:
                # Return mock data if Spotify credentials not configured
                mock_recommendations = [
                    {'name': 'Happy Song', 'artist': 'Artist Name', 'album': 'Album Name'},
                    {'name': 'Mood Music', 'artist': 'Band Name', 'album': 'Best Hits'},
                    {'name': 'Feeling Good', 'artist': 'Singer', 'album': 'Greatest Songs'},
                ]
                return Response({'recommendations': mock_recommendations, 'emotion': emotion})
            
            client_credentials_manager = SpotifyClientCredentials(
                client_id=settings.SPOTIFY_CLIENT_ID,
                client_secret=settings.SPOTIFY_CLIENT_SECRET
            )
            sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
            
            # Search for tracks based on genre and emotion
            recommendations = []
            seen_tracks = set()
            
            for genre in genres[:2]:  # Use top 2 genres
                # Search with genre and emotion keywords
                query = f'genre:{genre} mood {emotion}'
                results = sp.search(q=query, type='track', limit=10)
                
                for track in results['tracks']['items']:
                    track_id = track['id']
                    if track_id in seen_tracks:
                        continue
                    seen_tracks.add(track_id)
                    
                    recommendation = {
                        'name': track['name'],
                        'artist': ', '.join([artist['name'] for artist in track['artists']]),
                        'album': track['album']['name'],
                        'spotify_id': track_id,
                        'preview_url': track.get('preview_url'),
                        'album_image': track['album']['images'][0]['url'] if track['album']['images'] else None,
                        'spotify_url': track['external_urls']['spotify'],
                        'duration_ms': track['duration_ms'],
                    }
                    recommendations.append(recommendation)
                    
                    # Save to database
                    MusicRecommendation.objects.create(
                        user=request.user,
                        emotion=emotion,
                        name=recommendation['name'],
                        artist=recommendation['artist'],
                        album=recommendation['album'],
                        spotify_id=recommendation['spotify_id'],
                    )
            
            return Response({
                'recommendations': recommendations[:10],  # Return top 10
                'emotion': emotion
            })
        
        except Exception as e:
            return Response(
                {'error': f'Failed to get recommendations: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
