from django.urls import path

from rest_framework_simplejwt import views


urlpatterns = [
    path(
        'token/',
        views.TokenObtainPairView.as_view(),
        name='token-obtain'),
    path(
        'token/refresh/',
        views.TokenRefreshView.as_view(),
        name='token-refresh'),
    path(
        'token/verify/',
        views.TokenVerifyView.as_view(),
        name='token-verify'),
]
