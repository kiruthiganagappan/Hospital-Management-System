from rest_framework import serializers

from departments.models import Department
from departments.serializers import DepartmentSerializer
from doctors.models import Doctor
from doctors.serializers import DoctorSerializer
from patients.models import Patient
from patients.serializers import PatientSerializer

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True, required=False
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True
    )
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True, required=False
    )

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'department', 'patient_id', 'doctor_id', 'department_id',
            'appointment_date', 'appointment_time', 'reason_for_visit', 'status',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']

    def validate(self, attrs):
        doctor = attrs.get('doctor', getattr(self.instance, 'doctor', None))
        appointment_date = attrs.get('appointment_date', getattr(self.instance, 'appointment_date', None))
        appointment_time = attrs.get('appointment_time', getattr(self.instance, 'appointment_time', None))
        status_value = attrs.get('status', getattr(self.instance, 'status', Appointment.Status.PENDING))

        if doctor and appointment_date and appointment_time and status_value != Appointment.Status.CANCELLED:
            conflict = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
            ).exclude(status=Appointment.Status.CANCELLED)
            if self.instance:
                conflict = conflict.exclude(pk=self.instance.pk)
            if conflict.exists():
                raise serializers.ValidationError(
                    {'appointment_time': 'This doctor already has an appointment at the selected date and time.'}
                )
        return attrs
