from django.core.exceptions import ValidationError
from django.db import models

from departments.models import Department
from doctors.models import Doctor
from patients.models import Patient


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason_for_visit = models.TextField(blank=True, default='')
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-appointment_date', '-appointment_time']
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'appointment_date', 'appointment_time'],
                condition=~models.Q(status='CANCELLED'),
                name='unique_doctor_slot_when_not_cancelled',
            )
        ]

    def __str__(self):
        return f"{self.patient} with {self.doctor} on {self.appointment_date} {self.appointment_time}"

    def clean(self):
        conflict = Appointment.objects.filter(
            doctor=self.doctor,
            appointment_date=self.appointment_date,
            appointment_time=self.appointment_time,
        ).exclude(status=self.Status.CANCELLED).exclude(pk=self.pk)
        if conflict.exists():
            raise ValidationError('This doctor already has an appointment at the selected date and time.')
