from rest_framework import serializers

from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    doctor_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            'id', 'name', 'description', 'department_head',
            'doctor_count', 'created_at', 'updated_at',
        ]

    def get_doctor_count(self, obj):
        return obj.doctors.count()
