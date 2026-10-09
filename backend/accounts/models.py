from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):

    email = models.EmailField(unique=True)

    is_verified = models.BooleanField(default=False)

    otp = models.CharField(
        max_length=6,
        blank=True,
        null=True
    )

    otp_created_at = models.DateTimeField(
        blank=True,
        null=True
    )
