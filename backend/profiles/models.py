from django.db import models
from django.conf import settings

# Create your models here.
class Profile(models.Model):
    YEAR_CHOICES=[
        (1,"1st Year"),
        (2,"2nd Year"),
        (3,"3rd Year"),
        (4,"4th Year")
    ]
    BRANCH_CHOICES=[
        ("CSE", "CSE"),
        ("CSE-AI", "CSE-AI"),
        ("CSE-DS", "CSE-DS"),
        ("CSE-CS", "CSE-CS"),
        ("ECE", "ECE"),
        ("EEE", "EEE"),
        ("MECH", "MECH"),
        ("CIVIL", "CIVIL"),
    ]
    GENDER=[
        ("MALE","MALE"),
        ("FEMALE","FEMALE")
    ]
    user=models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    year=models.PositiveSmallIntegerField(choices=YEAR_CHOICES)
    branch=models.CharField(
        max_length=20,
        choices=BRANCH_CHOICES
    )
    
    college=models.CharField(
        max_length=200,
        default="Vignan's Institute of Information Technology, Duvvada"
    )
    gender=models.CharField(
            max_length=20,
            choices=GENDER,
            default="MALE"
    )
    is_available=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username