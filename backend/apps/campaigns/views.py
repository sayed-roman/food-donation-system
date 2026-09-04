from rest_framework import viewsets, permissions
from .models import Campaign
from .serializers import CampaignSerializer
from apps.users.permissions import IsNGOManagerOrAdmin


class CampaignViewSet(viewsets.ModelViewSet):
    """
    /api/campaigns/          - list (anyone authenticated), create (NGO manager/admin only)
    /api/campaigns/{id}/     - retrieve/update/delete (owner NGO or admin)
    """
    queryset = Campaign.objects.all().order_by('-created_at')
    serializer_class = CampaignSerializer
    filterset_fields = ['ngo']
    search_fields = ['title', 'description']
    ordering_fields = ['deadline', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsNGOManagerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(ngo=self.request.user)
