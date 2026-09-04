from rest_framework import serializers
from .models import Task, Feedback
from apps.donations.serializers import DonationSerializer


class TaskSerializer(serializers.ModelSerializer):
    donation_detail = DonationSerializer(source='donation', read_only=True)
    volunteer_username = serializers.CharField(source='volunteer.username', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'donation', 'donation_detail', 'volunteer', 'volunteer_username',
            'assigned_by', 'status', 'assigned_at', 'completed_at',
        ]
        read_only_fields = ['assigned_by', 'status', 'assigned_at', 'completed_at']


class TaskAssignSerializer(serializers.Serializer):
    donation_id = serializers.IntegerField()
    volunteer_id = serializers.IntegerField()


class FeedbackSerializer(serializers.ModelSerializer):
    submitted_by_username = serializers.CharField(source='submitted_by.username', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'task', 'submitted_by', 'submitted_by_username', 'rating', 'comment', 'created_at']
        read_only_fields = ['submitted_by']
