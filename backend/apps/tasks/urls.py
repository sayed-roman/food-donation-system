from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, FeedbackViewSet

router = DefaultRouter()
router.register('feedback', FeedbackViewSet, basename='feedback')
router.register('', TaskViewSet, basename='task')

urlpatterns = router.urls
