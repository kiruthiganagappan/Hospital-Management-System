from rest_framework import permissions, viewsets

from accounts.permissions import IsAdminUserRole
from .models import Department
from .serializers import DepartmentSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [IsAdminUserRole()]
