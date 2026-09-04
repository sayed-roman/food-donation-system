from django.contrib import admin
from .models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['title', 'ngo', 'goal_quantity', 'deadline', 'progress_percent']
