from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.donations.models import Donation
from apps.donations.serializers import DonationSerializer
from apps.campaigns.models import Campaign
from apps.users.permissions import IsAdminRole

User = get_user_model()


class AdminOverviewView(APIView):
    """
    GET /api/admin/analytics/overview/ - admin-only dashboard analytics:
    totals, status breakdown, donations-over-time (last 14 days), recent donations.
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        total_donations = Donation.objects.count()
        total_quantity = Donation.objects.aggregate(total=Sum('quantity'))['total'] or 0
        active_volunteers = User.objects.filter(role='volunteer', profile__is_available=True).count()
        pending_requests = Donation.objects.filter(status='pending').count()

        status_breakdown = list(
            Donation.objects.values('status').annotate(count=Count('id')).order_by('status')
        )

        since = timezone.now() - timedelta(days=14)
        donations_over_time = list(
            Donation.objects.filter(created_at__gte=since)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        recent_donations = Donation.objects.order_by('-created_at')[:10]

        return Response({
            'total_donations': total_donations,
            'total_quantity': total_quantity,
            'active_volunteers': active_volunteers,
            'pending_requests': pending_requests,
            'total_campaigns': Campaign.objects.count(),
            'status_breakdown': status_breakdown,
            'donations_over_time': [
                {'date': d['date'].isoformat(), 'count': d['count']} for d in donations_over_time
            ],
            'recent_donations': DonationSerializer(recent_donations, many=True, context={'request': request}).data,
        })
