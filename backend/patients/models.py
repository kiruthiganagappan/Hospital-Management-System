from django.conf import settings
from django.db import models


class Patient(models.Model):
    class Gender(models.TextChoices):
        MALE = 'MALE', 'Male'
        FEMALE = 'FEMALE', 'Female'
        OTHER = 'OTHER', 'Other'

    class BloodGroup(models.TextChoices):
        A_POS = 'A+', 'A+'
        A_NEG = 'A-', 'A-'
        B_POS = 'B+', 'B+'
        B_NEG = 'B-', 'B-'
        AB_POS = 'AB+', 'AB+'
        AB_NEG = 'AB-', 'AB-'
        O_POS = 'O+', 'O+'
        O_NEG = 'O-', 'O-'
        UNKNOWN = 'UNKNOWN', 'Unknown'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile'
    )
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True, default='')
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, blank=True, default='')
    blood_group = models.CharField(max_length=10, choices=BloodGroup.choices, default=BloodGroup.UNKNOWN)
    emergency_contact_name = models.CharField(max_length=150, blank=True, default='')
    emergency_contact_phone = models.CharField(max_length=20, blank=True, default='')
    allergies = models.TextField(blank=True, default='')
    current_medications = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.user.full_name

    @property
    def age(self):
        if not self.date_of_birth:
            return None
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
