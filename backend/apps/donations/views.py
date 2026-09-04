from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Donation
from .serializers import DonationSerializer, NearbyVolunteerSerializer
from .utils import haversine_km
from apps.users.permissions import IsDonor, IsOwnerOrAdmin, IsNGOManagerOrAdmin

User = get_user_model()


class IsDonationOwnerOrAdmin(IsOwnerOrAdmin):
    owner_field = 'donor'


class DonationViewSet(viewsets.ModelViewSet):
    """
    /api/donations/                     - list (filterable/searchable/paginated), create (donor only)
    /api/donations/{id}/                - retrieve/update/delete (owner donor or admin)
    /api/donations/{id}/nearby_volunteers/  - GET nearby available volunteers for this donation
    """
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    filterset_fields = ['status', 'food_type', 'campaign', 'donor']
    search_fields = ['food_type', 'pickup_address']
    ordering_fields = ['created_at', 'expiry_date']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsDonor()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsDonationOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsNGOManagerOrAdmin])
    def nearby_volunteers(self, request, pk=None):
        """Returns available volunteers sorted by distance to this donation's pickup point."""
        donation = self.get_object()
        volunteers = User.objects.filter(role='volunteer', profile__is_available=True)

        results = []
        for v in volunteers:
            profile = getattr(v, 'profile', None)
            if not profile or profile.latitude is None or profile.longitude is None:
                continue
            dist = haversine_km(
                donation.pickup_latitude, donation.pickup_longitude,
                profile.latitude, profile.longitude,
            )
            results.append({'id': v.id, 'username': v.username, 'distance_km': round(dist, 2)})

        results.sort(key=lambda r: r['distance_km'])
        serializer = NearbyVolunteerSerializer(results[:10], many=True)
        return Response(serializer.data)
