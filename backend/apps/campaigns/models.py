from django.db import models
from django.conf import settings


class Campaign(models.Model):
    ngo = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='campaigns',
        limit_choices_to={'role': 'ngo_manager'},
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    goal_quantity = models.PositiveIntegerField(help_text='Target quantity (e.g. number of meals/kg of food)')
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def collected_quantity(self):
        # Sum quantity of donations linked to this campaign
        return self.donations.aggregate(total=models.Sum('quantity'))['total'] or 0

    @property
    def progress_percent(self):
        if self.goal_quantity == 0:
            return 0
        return min(100, round((self.collected_quantity / self.goal_quantity) * 100, 1))
