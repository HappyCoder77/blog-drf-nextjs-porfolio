from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


class CustomUser(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):

        if not self.pk or not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            queryset = Post.objects.filter(slug__startswith=base_slug).exclude(
                pk=self.pk
            )

            while queryset.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created_at"]
