from django.contrib import admin

from .models import MedicalRecord, Prescription


class PrescriptionInline(admin.TabularInline):
    model = Prescription
    extra = 1


class MedicalRecordAdmin(admin.ModelAdmin):
    inlines = [PrescriptionInline]


admin.site.register(MedicalRecord, MedicalRecordAdmin)
