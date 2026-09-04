from rest_framework.permissions import BasePermission


class IsRole(BasePermission):
    """Generic role-check permission. Subclass and set `allowed_roles`."""
    allowed_roles = []

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role in self.allowed_roles or request.user.is_superuser)
        )


class IsDonor(IsRole):
    allowed_roles = ['donor']


class IsVolunteer(IsRole):
    allowed_roles = ['volunteer']


class IsNGOManager(IsRole):
    allowed_roles = ['ngo_manager']


class IsAdminRole(IsRole):
    allowed_roles = ['admin']


class IsNGOManagerOrAdmin(IsRole):
    allowed_roles = ['ngo_manager', 'admin']


class IsOwnerOrAdmin(BasePermission):
    """Object-level permission: only the owner (obj.donor / obj.user etc.) or an admin can modify."""

    owner_field = 'user'

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        owner = getattr(obj, self.owner_field, None)
        return owner == request.user
