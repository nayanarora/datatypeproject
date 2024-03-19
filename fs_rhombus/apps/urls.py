from rest_framework import routers
from .api import appViewSet

router = routers.DefaultRouter()
router.register('api/apps', appViewSet, 'apps')

urlpatterns = router.urls