from django.contrib import admin
from .models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ['food_type', 'donor', 'quantity', 'unit', 'status', 'created_at']
    list_filter = ['status', 'food_type']
