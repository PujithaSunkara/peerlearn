
from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "year",
            "branch",
            "college",
            "gender",
            "is_available",
        ]
