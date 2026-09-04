from django.db import models
from django.conf import settings


class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications',
    )
    message = models.CharField(max_length=255)
    link = models.CharField(max_length=255, blank=True, help_text='Optional frontend route, e.g. /donations/12')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Notification to {self.recipient.username}: {self.message[:40]}'
