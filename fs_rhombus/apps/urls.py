# from rest_framework import routers
# from .api import appViewSet

# router = routers.DefaultRouter()
# router.register('api/apps', appViewSet, 'apps')

# urlpatterns = router.urls

from django.urls import path
from .views import InferDataTypesView

urlpatterns = [
    path('infer/', InferDataTypesView.as_view(), name='infer_data_types'),
]
