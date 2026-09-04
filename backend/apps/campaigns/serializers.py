from rest_framework import serializers
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    ngo_name = serializers.CharField(source='ngo.profile.organization_name', read_only=True)
    collected_quantity = serializers.ReadOnlyField()
    progress_percent = serializers.ReadOnlyField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'ngo', 'ngo_name', 'title', 'description', 'goal_quantity',
            'deadline', 'created_at', 'collected_quantity', 'progress_percent',
        ]
        read_only_fields = ['ngo']
