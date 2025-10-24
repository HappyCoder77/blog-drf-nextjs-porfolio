from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        # Permitir métodos seguros (GET, HEAD, OPTIONS) para todos.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Para otros métodos (POST), el usuario debe estar autenticado.
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.author.pk == request.user.pk
