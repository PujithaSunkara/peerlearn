from django.db import models
from django.conf import settings

# Create your models here.
class Skill(models.Model):
    name=models.CharField(max_length=100,unique=True)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class StudentSkill(models.Model):
    student=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="skills"
    )
    skill=models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="students"
    )
    percentage=models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )
    updated_at=models.DateTimeField(auto_now=True)