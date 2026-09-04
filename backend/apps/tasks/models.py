from django.db import models
from django.conf import settings
from apps.donations.models import Donation


class Task(models.Model):
    class Status(models.TextChoices):
        ASSIGNED = 'assigned', 'Assigned'
        PICKED_UP = 'picked_up', 'Picked Up'
        DELIVERED = 'delivered', 'Delivered'

    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='task')
    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks',
        limit_choices_to={'role': 'volunteer'},
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='tasks_assigned',
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ASSIGNED)
    assigned_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Task for {self.donation} -> {self.volunteer.username}'


class Feedback(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='feedback_entries')
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='feedback_given')
    rating = models.PositiveSmallIntegerField(help_text='1-5')
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['task', 'submitted_by']

    def __str__(self):
        return f'Feedback ({self.rating}/5) on {self.task}'
