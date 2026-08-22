from datetime import date

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminUserRole, IsDoctor, IsPatient
from appointments.models import Appointment
from departments.models import Department
from doctors.models import Doctor
from patients.models import Patient


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        today = date.today()
        appointments = Appointment.objects.all()
        data = {
            'total_doctors': Doctor.objects.count(),
            'total_patients': Patient.objects.count(),
            'total_departments': Department.objects.count(),
            'total_appointments': appointments.count(),
            'pending_appointments': appointments.filter(status='PENDING').count(),
            'confirmed_appointments': appointments.filter(status='CONFIRMED').count(),
            'completed_appointments': appointments.filter(status='COMPLETED').count(),
            'cancelled_appointments': appointments.filter(status='CANCELLED').count(),
            'todays_appointments': appointments.filter(appointment_date=today).count(),
        }
        return Response(data)


class DoctorDashboardView(APIView):
    permission_classes = [IsDoctor]

    def get(self, request):
        today = date.today()
        doctor = Doctor.objects.filter(user=request.user).first()
        if not doctor:
            return Response({'detail': 'Doctor profile not found.'}, status=404)
        appointments = Appointment.objects.filter(doctor=doctor)
        data = {
            'todays_appointments': appointments.filter(appointment_date=today).count(),
            'upcoming_appointments': appointments.filter(
                appointment_date__gte=today
            ).exclude(status='CANCELLED').count(),
            'total_patients': appointments.values('patient').distinct().count(),
            'completed_consultations': appointments.filter(status='COMPLETED').count(),
        }
        return Response(data)


class PatientDashboardView(APIView):
    permission_classes = [IsPatient]

    def get(self, request):
        patient = Patient.objects.filter(user=request.user).first()
        if not patient:
            return Response({'detail': 'Patient profile not found.'}, status=404)
        appointments = Appointment.objects.filter(patient=patient)
        data = {
            'upcoming_appointments': appointments.exclude(
                status__in=['COMPLETED', 'CANCELLED']
            ).count(),
            'completed_appointments': appointments.filter(status='COMPLETED').count(),
            'prescriptions': sum(
                mr.prescriptions.count() for mr in patient.medical_records.all()
            ),
            'medical_records': patient.medical_records.count(),
        }
        return Response(data)
