from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with a role field. Role-specific extra fields live on Profile."""

    class Role(models.TextChoices):
        DONOR = 'donor', 'Donor'
        VOLUNTEER = 'volunteer', 'Volunteer'
        NGO_MANAGER = 'ngo_manager', 'NGO Manager'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.DONOR)
    phone_number = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f'{self.username} ({self.role})'


class Profile(models.Model):
    """Role-specific profile data. One-to-one with User."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Common
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    # Volunteer-specific
    is_available = models.BooleanField(default=True)

    # NGO-specific
    organization_name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f'Profile of {self.user.username}'
