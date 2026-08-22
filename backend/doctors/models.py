from django.conf import settings
from django.db import models

from departments.models import Department


class Doctor(models.Model):
    class Gender(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'
        OTHER = 'OTHER', 'Other'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile'
    )
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True, default='')
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, blank=True, default='')
    qualification = models.CharField(max_length=255, blank=True, default='')
    specialization = models.CharField(max_length=150, blank=True, default='')
    experience_years = models.PositiveIntegerField(default=0)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='doctors'
    )
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    available_days = models.CharField(
        max_length=100, blank=True, default='',
        help_text='Comma separated, e.g. Mon,Tue,Wed,Thu,Fri',
    )
    available_start_time = models.TimeField(null=True, blank=True)
    available_end_time = models.TimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Dr. {self.user.full_name}"
