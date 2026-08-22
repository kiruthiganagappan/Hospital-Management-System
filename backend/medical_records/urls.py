from rest_framework.routers import DefaultRouter

from .views import MedicalRecordViewSet, PrescriptionViewSet

router = DefaultRouter()
router.register('prescriptions', PrescriptionViewSet, basename='prescription')
router.register('', MedicalRecordViewSet, basename='medical-record')

urlpatterns = router.urls
