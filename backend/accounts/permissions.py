from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    """Allows access only to users with the ADMIN role."""

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == 'ADMIN'
        )


class IsDoctor(BasePermission):
    """Allows access only to users with the DOCTOR role."""

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == 'DOCTOR'
        )


class IsPatient(BasePermission):
    """Allows access only to users with the PATIENT role."""

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == 'PATIENT'
        )


class IsAdminOrDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role in ('ADMIN', 'DOCTOR')
        )


class IsAdminOrReadOnlyOwner(BasePermission):
    """Admins have full access; others may only read their own data."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
