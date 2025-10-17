from django.contrib import admin
from .models import CustomUser, Post
from django.contrib.auth.admin import UserAdmin


admin.site.register(CustomUser, UserAdmin)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "created_at", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    list_filter = ("created_at", "author")
    search_fields = ("title", "content")
