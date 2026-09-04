from .models import Notification


def notify(recipient, message, link=''):
    """Small helper used by other apps (tasks, donations) to create a notification
    without needing to import their viewsets directly."""
    return Notification.objects.create(recipient=recipient, message=message, link=link)
