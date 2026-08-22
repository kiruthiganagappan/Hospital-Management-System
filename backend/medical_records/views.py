from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from doctors.models import Doctor

from .models import MedicalRecord, Prescription
from .serializers import MedicalRecordSerializer, PrescriptionSerializer


class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.select_related('patient__user', 'doctor__user').all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.role == 'DOCTOR':
            qs = qs.filter(doctor__user=user)
        elif user.role == 'PATIENT':
            qs = qs.filter(patient__user=user)
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs

    def create(self, request, *args, **kwargs):
        if request.user.role not in ('DOCTOR', 'ADMIN'):
            return Response({'detail': 'Only doctors can create medical records.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        if request.user.role == 'DOCTOR' and 'doctor_id' not in data:
            doctor = Doctor.objects.filter(user=request.user).first()
            if doctor:
                data['doctor_id'] = doctor.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        record = serializer.save()
        return Response(MedicalRecordSerializer(record).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.role == 'DOCTOR' and instance.doctor.user != request.user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role == 'PATIENT':
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'ADMIN':
            return Response({'detail': 'Only admin can delete medical records.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related('medical_record').all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.role == 'DOCTOR':
            qs = qs.filter(medical_record__doctor__user=user)
        elif user.role == 'PATIENT':
            qs = qs.filter(medical_record__patient__user=user)
        return qs
