from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'address', 'latitude', 'longitude', 'profile_picture',
            'is_available', 'organization_name',
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'profile']
        read_only_fields = ['role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    organization_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'phone_number', 'role', 'organization_name',
        ]

    def create(self, validated_data):
        org_name = validated_data.pop('organization_name', '')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        Profile.objects.create(user=user, organization_name=org_name)
        return user


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Allows updating both User fields and nested Profile fields together."""
    address = serializers.CharField(source='profile.address', required=False, allow_blank=True)
    latitude = serializers.FloatField(source='profile.latitude', required=False, allow_null=True)
    longitude = serializers.FloatField(source='profile.longitude', required=False, allow_null=True)
    is_available = serializers.BooleanField(source='profile.is_available', required=False)
    organization_name = serializers.CharField(source='profile.organization_name', required=False, allow_blank=True)
    profile_picture = serializers.ImageField(source='profile.profile_picture', required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number',
            'address', 'latitude', 'longitude', 'is_available',
            'organization_name', 'profile_picture',
        ]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()
        return instance


class AdminUserSerializer(serializers.ModelSerializer):
    """Used by admin-only user/volunteer/organization management endpoints."""
    address = serializers.CharField(source='profile.address', required=False, allow_blank=True)
    latitude = serializers.FloatField(source='profile.latitude', required=False, allow_null=True)
    longitude = serializers.FloatField(source='profile.longitude', required=False, allow_null=True)
    is_available = serializers.BooleanField(source='profile.is_available', required=False)
    organization_name = serializers.CharField(source='profile.organization_name', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone_number',
            'role', 'is_active', 'date_joined', 'address', 'latitude', 'longitude',
            'is_available', 'organization_name',
        ]
        read_only_fields = ['username', 'date_joined']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if hasattr(instance, 'profile'):
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        return instance
