from django.db import models
from django.conf import settings


class Donation(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ASSIGNED = 'assigned', 'Assigned'
        PICKED_UP = 'picked_up', 'Picked Up'
        DELIVERED = 'delivered', 'Delivered'

    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='donations',
        limit_choices_to={'role': 'donor'},
    )
    food_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(help_text='Quantity in units chosen by the donor (kg, meals, etc.)')
    unit = models.CharField(max_length=30, default='kg')
    expiry_date = models.DateField(null=True, blank=True)
    pickup_address = models.CharField(max_length=255)
    pickup_latitude = models.FloatField()
    pickup_longitude = models.FloatField()
    photo = models.ImageField(upload_to='donation_photos/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    campaign = models.ForeignKey(
        'campaigns.Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name='donations',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.food_type} ({self.quantity}{self.unit}) by {self.donor.username}'
