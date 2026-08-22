from rest_framework import serializers

from accounts.models import User
from accounts.serializers import UserSerializer
from departments.serializers import DepartmentSerializer
from departments.models import Department

from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True, required=False
    )

    class Meta:
        model = Doctor
        fields = [
            'id', 'user', 'gender', 'date_of_birth', 'address', 'qualification',
            'specialization', 'experience_years', 'department', 'department_id',
            'consultation_fee', 'available_days', 'available_start_time',
            'available_end_time', 'is_active', 'created_at', 'updated_at',
        ]


class DoctorCreateSerializer(serializers.ModelSerializer):
    """Used by Admin to create a doctor + linked user account in one call."""

    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Doctor
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name', 'phone',
            'gender', 'date_of_birth', 'address', 'qualification', 'specialization',
            'experience_years', 'department', 'consultation_fee', 'available_days',
            'available_start_time', 'available_end_time', 'is_active',
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
        user = User(role=User.Role.DOCTOR, **user_data)
        user.set_password(password)
        user.save()
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor
