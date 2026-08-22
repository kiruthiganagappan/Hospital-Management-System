from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdminUserRole

from .models import Patient
from .serializers import (
    PatientCompleteHistorySerializer,
    PatientCreateSerializer,
    PatientSerializer,
)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.select_related('user').all()
    serializer_class = PatientSerializer

    def get_permissions(self):
        if self.action in ('list', 'create', 'destroy', 'complete_history'):
            return [IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return PatientCreateSerializer
        return PatientSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(user__first_name__icontains=search) | qs.filter(
                user__last_name__icontains=search
            ) | qs.filter(user__email__icontains=search)
        if user.role == 'PATIENT':
            qs = qs.filter(user=user)
        return qs.distinct()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.role == 'PATIENT' and instance.user != request.user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        return Response(self.get_serializer(instance).data)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        patient = serializer.save()
        return Response(PatientSerializer(patient).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='complete-history', permission_classes=[IsAdminUserRole])
    def complete_history(self, request, pk=None):
        patient = get_object_or_404(Patient, pk=pk)
        return Response(PatientCompleteHistorySerializer(patient).data)
