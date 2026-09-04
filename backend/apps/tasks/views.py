from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Task, Feedback
from .serializers import TaskSerializer, TaskAssignSerializer, FeedbackSerializer
from apps.donations.models import Donation
from apps.users.permissions import IsNGOManagerOrAdmin, IsVolunteer
from apps.notifications.services import notify

User = get_user_model()


class TaskViewSet(viewsets.ModelViewSet):
    """
    /api/tasks/accept/              - POST {donation_id} - volunteer self-assigns a pending pickup (pull-based)
    /api/tasks/assign/               - POST {donation_id, volunteer_id} (admin/NGO manager override)
    /api/tasks/{id}/                 - retrieve
    /api/tasks/{id}/mark_picked_up/  - POST (assigned volunteer only)
    /api/tasks/{id}/mark_delivered/  - POST (assigned volunteer only)
    /api/tasks/my_tasks/             - GET tasks assigned to the logged-in volunteer
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filterset_fields = ['donation']
    http_method_names = ['get', 'post', 'head', 'options']  # no raw PUT/PATCH/DELETE, use actions instead

    def get_permissions(self):
        if self.action == 'assign':
            return [permissions.IsAuthenticated(), IsNGOManagerOrAdmin()]
        if self.action in ['accept', 'mark_picked_up', 'mark_delivered']:
            return [permissions.IsAuthenticated(), IsVolunteer()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'])
    def accept(self, request):
        """POST /api/tasks/accept/ {donation_id} - a volunteer self-assigns a pending pickup (pull-based flow)."""
        donation_id = request.data.get('donation_id')
        donation = get_object_or_404(Donation, pk=donation_id)

        if donation.status != Donation.Status.PENDING:
            return Response({'detail': 'This donation is no longer available for pickup.'}, status=status.HTTP_400_BAD_REQUEST)
        if hasattr(donation, 'task'):
            return Response({'detail': 'This donation already has a volunteer assigned.'}, status=status.HTTP_400_BAD_REQUEST)

        task = Task.objects.create(donation=donation, volunteer=request.user, assigned_by=request.user)
        donation.status = Donation.Status.ASSIGNED
        donation.save(update_fields=['status'])

        notify(
            recipient=donation.donor,
            message=f'{request.user.username} accepted the pickup for your donation "{donation.food_type}".',
            link=f'/donations/{donation.id}',
        )
        return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def assign(self, request):
        serializer = TaskAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        donation = get_object_or_404(Donation, pk=serializer.validated_data['donation_id'])
        volunteer = get_object_or_404(User, pk=serializer.validated_data['volunteer_id'], role='volunteer')

        if hasattr(donation, 'task'):
            return Response({'detail': 'This donation already has a task assigned.'}, status=status.HTTP_400_BAD_REQUEST)

        task = Task.objects.create(donation=donation, volunteer=volunteer, assigned_by=request.user)
        donation.status = Donation.Status.ASSIGNED
        donation.save(update_fields=['status'])

        notify(
            recipient=volunteer,
            message=f'You have been assigned a new pickup task: {donation.food_type} at {donation.pickup_address}.',
            link=f'/tasks/{task.id}',
        )
        return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        tasks = Task.objects.filter(volunteer=request.user)
        return Response(TaskSerializer(tasks, many=True).data)

    @action(detail=True, methods=['post'])
    def mark_picked_up(self, request, pk=None):
        task = self.get_object()
        if task.volunteer != request.user:
            return Response({'detail': 'Not your task.'}, status=status.HTTP_403_FORBIDDEN)
        task.status = Task.Status.PICKED_UP
        task.save(update_fields=['status'])
        task.donation.status = Donation.Status.PICKED_UP
        task.donation.save(update_fields=['status'])
        notify(
            recipient=task.donation.donor,
            message=f'Your donation "{task.donation.food_type}" has been picked up.',
            link=f'/donations/{task.donation.id}',
        )
        return Response(TaskSerializer(task).data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsVolunteer])
    def my_stats(self, request):
        """GET /api/tasks/my_stats/ - summary numbers for the volunteer dashboard."""
        my_tasks = Task.objects.filter(volunteer=request.user)
        completed = my_tasks.filter(status=Task.Status.DELIVERED)
        week_ago = timezone.now() - timedelta(days=7)

        avg_rating = Feedback.objects.filter(
            task__volunteer=request.user
        ).aggregate(avg=Avg('rating'))['avg']

        return Response({
            'available_pickups': Donation.objects.filter(status=Donation.Status.PENDING).count(),
            'completed_deliveries': completed.count(),
            'this_week': completed.filter(completed_at__gte=week_ago).count(),
            'average_rating': round(avg_rating, 1) if avg_rating else None,
        })

    @action(detail=True, methods=['post'])
    def mark_delivered(self, request, pk=None):
        task = self.get_object()
        if task.volunteer != request.user:
            return Response({'detail': 'Not your task.'}, status=status.HTTP_403_FORBIDDEN)
        task.status = Task.Status.DELIVERED
        task.completed_at = timezone.now()
        task.save(update_fields=['status', 'completed_at'])
        task.donation.status = Donation.Status.DELIVERED
        task.donation.save(update_fields=['status'])
        notify(
            recipient=task.donation.donor,
            message=f'Your donation "{task.donation.food_type}" has been delivered. Thank you!',
            link=f'/donations/{task.donation.id}',
        )
        return Response(TaskSerializer(task).data)


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    /api/tasks/feedback/         - list/create feedback (donor rating the volunteer on a delivered task)
    /api/tasks/feedback/?task=<id> - filter to a specific task, to check if the donor already left feedback
    """
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['task']

    def get_queryset(self):
        return Feedback.objects.filter(task__status=Task.Status.DELIVERED)

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        user = self.request.user
        if user != task.donation.donor:
            raise PermissionDenied("Only the donor of this donation can leave feedback for the volunteer.")
        serializer.save(submitted_by=user)
