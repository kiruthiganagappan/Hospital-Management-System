from django.db import models

from appointments.models import Appointment
from doctors.models import Doctor
from patients.models import Patient


class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='medical_records')
    appointment = models.OneToOneField(
        Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='medical_record'
    )
    diagnosis = models.TextField()
    symptoms = models.TextField(blank=True, default='')
    notes = models.TextField(blank=True, default='')
    test_results = models.TextField(blank=True, default='')
    follow_up_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Record for {self.patient} by {self.doctor}"


class Prescription(models.Model):
    medical_record = models.ForeignKey(
        MedicalRecord, on_delete=models.CASCADE, related_name='prescriptions'
    )
    medicine_name = models.CharField(max_length=150)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.medicine_name} ({self.dosage})"
