from .models import Skill
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
       model=Skill
       fields="__all__"