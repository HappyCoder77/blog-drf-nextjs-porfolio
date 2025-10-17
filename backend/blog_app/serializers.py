from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Post
        fields = ["id", "title", "content", "created_at", "author_username"]
        read_only_fields = ["author_username"]
