from rest_framework import serializers

from accounts.models import User
from accounts.serializers import UserSerializer

from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    age = serializers.ReadOnlyField()

    class Meta:
        model = Patient
        fields = [
            'id', 'user', 'gender', 'date_of_birth', 'age', 'address', 'blood_group',
            'emergency_contact_name', 'emergency_contact_phone', 'allergies',
            'current_medications', 'created_at', 'updated_at',
        ]


class PatientCreateSerializer(serializers.ModelSerializer):
    """Used by Admin to create a patient + linked user account in one call."""

    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name', 'phone',
            'gender', 'date_of_birth', 'address', 'blood_group', 'emergency_contact_name',
            'emergency_contact_phone', 'allergies', 'current_medications',
        ]

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Username already taken.'})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email already registered.'})
        return attrs

    def create(self, validated_data):
        user_fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone']
        user_data = {f: validated_data.pop(f) for f in user_fields if f in validated_data}
        password = user_data.pop('password')
        user = User(role=User.Role.PATIENT, **user_data)
        user.set_password(password)
        user.save()
        patient = Patient.objects.create(user=user, **validated_data)
        return patient


class PatientCompleteHistorySerializer(serializers.Serializer):
    patient_information = serializers.SerializerMethodField()
    appointments = serializers.SerializerMethodField()
    medical_records = serializers.SerializerMethodField()
    prescriptions = serializers.SerializerMethodField()

    def get_patient_information(self, obj):
        return PatientSerializer(obj).data

    def get_appointments(self, obj):
        from appointments.serializers import AppointmentSerializer
        return AppointmentSerializer(obj.appointments.all().order_by('-appointment_date'), many=True).data

    def get_medical_records(self, obj):
        from medical_records.serializers import MedicalRecordSerializer
        return MedicalRecordSerializer(obj.medical_records.all().order_by('-created_at'), many=True).data

    def get_prescriptions(self, obj):
        from medical_records.serializers import PrescriptionSerializer
        from medical_records.models import Prescription
        prescriptions = Prescription.objects.filter(medical_record__patient=obj).order_by('-id')
        return PrescriptionSerializer(prescriptions, many=True).data
