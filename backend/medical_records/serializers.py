from django.db import transaction
from rest_framework import serializers

from appointments.models import Appointment
from doctors.models import Doctor
from doctors.serializers import DoctorSerializer
from patients.models import Patient
from patients.serializers import PatientSerializer

from .models import MedicalRecord, Prescription


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['id', 'medical_record', 'medicine_name', 'dosage', 'frequency', 'duration', 'instructions']
        read_only_fields = ['medical_record']


class PrescriptionInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['medicine_name', 'dosage', 'frequency', 'duration', 'instructions']


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    prescriptions = PrescriptionSerializer(many=True, read_only=True)

    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True, required=False
    )
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source='appointment', write_only=True, required=False, allow_null=True
    )
    prescriptions_input = PrescriptionInputSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'patient', 'doctor', 'appointment', 'patient_id', 'doctor_id', 'appointment_id',
            'diagnosis', 'symptoms', 'notes', 'test_results', 'follow_up_date',
            'prescriptions', 'prescriptions_input', 'created_at', 'updated_at',
        ]

    @transaction.atomic
    def create(self, validated_data):
        prescriptions_data = validated_data.pop('prescriptions_input', [])
        record = MedicalRecord.objects.create(**validated_data)
        for item in prescriptions_data:
            Prescription.objects.create(medical_record=record, **item)
        appointment = validated_data.get('appointment')
        if appointment:
            appointment.status = Appointment.Status.COMPLETED
            appointment.save()
        return record

    @transaction.atomic
    def update(self, instance, validated_data):
        prescriptions_data = validated_data.pop('prescriptions_input', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if prescriptions_data is not None:
            instance.prescriptions.all().delete()
            for item in prescriptions_data:
                Prescription.objects.create(medical_record=instance, **item)
        return instance
