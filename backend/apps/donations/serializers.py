from rest_framework import serializers
from .models import Donation


class DonationSerializer(serializers.ModelSerializer):
    donor_username = serializers.CharField(source='donor.username', read_only=True)

    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'donor_username', 'food_type', 'quantity', 'unit',
            'expiry_date', 'pickup_address', 'pickup_latitude', 'pickup_longitude',
            'photo', 'status', 'campaign', 'created_at', 'updated_at',
        ]
        read_only_fields = ['donor', 'status']


class NearbyVolunteerSerializer(serializers.Serializer):
    """Read-only shape used for the 'nearby volunteers' endpoint response."""
    id = serializers.IntegerField()
    username = serializers.CharField()
    distance_km = serializers.FloatField()
