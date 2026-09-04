from rest_framework import generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile
from .serializers import RegisterSerializer, UserSerializer, UpdateProfileSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ - open to anyone."""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds role/username to the JWT payload so the frontend can read it without an extra call."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """POST /api/auth/login/"""
    serializer_class = CustomTokenObtainPairSerializer


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/me/ - view or update the logged-in user's own profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return UpdateProfileSerializer
        return UserSerializer


from django.contrib.auth import get_user_model
from rest_framework import viewsets, filters as drf_filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import AdminUserSerializer
from .permissions import IsAdminRole

User = get_user_model()


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin-only management of all users (used for the Users / Volunteers / Organizations
    sections of the admin dashboard - the frontend filters by ?role=).

    /api/admin/users/                 - list (filter with ?role=volunteer etc.), search by username/email
    /api/admin/users/{id}/            - retrieve/update (role, is_active, profile fields)
    /api/admin/users/{id}/deactivate/ - POST to deactivate a user (soft "delete")
    /api/admin/users/{id}/activate/   - POST to reactivate a user
    """
    queryset = User.objects.all().select_related('profile').order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    filter_backends = [DjangoFilterBackend, drf_filters.SearchFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save(update_fields=['is_active'])
        return Response(AdminUserSerializer(user).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save(update_fields=['is_active'])
        return Response(AdminUserSerializer(user).data)
