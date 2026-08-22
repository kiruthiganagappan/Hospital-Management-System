from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'first_name', 'last_name', 'is_active_account')
    list_filter = ('role', 'is_active_account', 'is_staff')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role', 'phone', 'profile_image', 'is_active_account')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Role Info', {'fields': ('email', 'role', 'phone')}),
    )


admin.site.register(User, UserAdmin)
