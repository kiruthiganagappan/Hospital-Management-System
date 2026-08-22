from django.db import transaction
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdminUserRole

from .models import Doctor
from .serializers import DoctorCreateSerializer, DoctorSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.select_related('user', 'department').all()
    serializer_class = DoctorSerializer
    filterset_fields = ['department', 'is_active']
    search_fields = ['user__first_name', 'user__last_name', 'specialization']

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [IsAdminUserRole()]

    def get_serializer_class(self):
        if self.action == 'create':
            return DoctorCreateSerializer
        return DoctorSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        department = self.request.query_params.get('department')
        search = self.request.query_params.get('search')
        is_active = self.request.query_params.get('is_active')
        if department:
            qs = qs.filter(department_id=department)
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        if search:
            qs = qs.filter(
                user__first_name__icontains=search
            ) | qs.filter(user__last_name__icontains=search) | qs.filter(
                specialization__icontains=search
            )
        return qs.distinct()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        doctor = serializer.save()
        return Response(DoctorSerializer(doctor).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def toggle_active(self, request, pk=None):
        doctor = self.get_object()
        doctor.is_active = not doctor.is_active
        doctor.save()
        return Response(DoctorSerializer(doctor).data)
