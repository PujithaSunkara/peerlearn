
from django.conf import settings
from django.db import models


class VideoRoom(models.Model):
    room_id = models.CharField(max_length=64, unique=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_video_rooms",
    )

    participant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="joined_video_rooms",
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.room_id
