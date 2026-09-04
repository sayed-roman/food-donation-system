from django.contrib import admin
from .models import Task, Feedback


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['donation', 'volunteer', 'status', 'assigned_at', 'completed_at']


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['task', 'submitted_by', 'rating', 'created_at']
