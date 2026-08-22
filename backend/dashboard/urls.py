from django.urls import path

from .views import AdminDashboardView, DoctorDashboardView, PatientDashboardView

urlpatterns = [
    path('admin/', AdminDashboardView.as_view(), name='dashboard-admin'),
    path('doctor/', DoctorDashboardView.as_view(), name='dashboard-doctor'),
    path('patient/', PatientDashboardView.as_view(), name='dashboard-patient'),
]
