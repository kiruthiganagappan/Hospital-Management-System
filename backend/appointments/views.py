from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from doctors.models import Doctor
from patients.models import Patient

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related(
        'patient__user', 'doctor__user', 'department'
    ).all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.role == 'ADMIN':
            pass
        elif user.role == 'DOCTOR':
            qs = qs.filter(doctor__user=user)
        elif user.role == 'PATIENT':
            qs = qs.filter(patient__user=user)

        status_filter = self.request.query_params.get('status')
        date_filter = self.request.query_params.get('date')
        doctor_filter = self.request.query_params.get('doctor')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if date_filter:
            qs = qs.filter(appointment_date=date_filter)
        if doctor_filter:
            qs = qs.filter(doctor_id=doctor_filter)
        return qs

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        user = request.user
        if user.role == 'PATIENT':
            patient = Patient.objects.filter(user=user).first()
            if not patient:
                return Response({'detail': 'Patient profile not found.'}, status=status.HTTP_400_BAD_REQUEST)
            data['patient_id'] = patient.id
        elif user.role == 'ADMIN':
            if 'patient_id' not in data:
                return Response({'patient_id': 'This field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Doctors cannot book appointments.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        return Response(AppointmentSerializer(appointment).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if user.role == 'PATIENT' and instance.patient.user != user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)
        if user.role == 'DOCTOR' and instance.doctor.user != user:
            return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        # Patients may only cancel; doctors/admin may change full status.
        if user.role == 'PATIENT':
            allowed_status = {Appointment.Status.CANCELLED}
            if 'status' in data and data['status'] not in allowed_status:
                return Response({'status': 'Patients may only cancel appointments.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'ADMIN':
            return Response({'detail': 'Only admin can delete appointments.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
