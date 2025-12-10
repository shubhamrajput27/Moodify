from django.urls import path
from .views import (
    RegisterView, LoginView, TextEmotionView, 
    SpeechEmotionView, FacialEmotionView, MusicRecommendationView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('text_emotion/', TextEmotionView.as_view(), name='text_emotion'),
    path('speech_emotion/', SpeechEmotionView.as_view(), name='speech_emotion'),
    path('facial_emotion/', FacialEmotionView.as_view(), name='facial_emotion'),
    path('music_recommendation/', MusicRecommendationView.as_view(), name='music_recommendation'),
]
