
from django.db import transaction

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Profile
from .serializers import ProfileSerializer
from skills.models import Skill, StudentSkill


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response(
                {"message": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        skills = StudentSkill.objects.filter(
            student=request.user
        ).select_related("skill")

        data = ProfileSerializer(profile).data
        data.update({
            "username": request.user.username,
            "email": request.user.email,
            "full_name": request.user.get_full_name(),
            "skills": [
                item.skill.name for item in skills
            ],
        })

        return Response(data)

    def post(self, request):
        data = request.data
        skill_names = data.get("skills", [])

        if not isinstance(skill_names, list):
            return Response(
                {"message": "Skills must be a list."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if any(
            not isinstance(name, str) or not name.strip()
            for name in skill_names
        ):
            return Response(
                {"message": "Invalid skill name."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProfileSerializer(data=data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            profile, created = Profile.objects.update_or_create(
                user=request.user,
                defaults={
                    key: value
                    for key, value in serializer.validated_data.items()
                    if key != "is_available"
                }
            )

            self.save_skills(request.user, skill_names)

        return Response(
            {"message": "Profile saved successfully."},
            status=(
                status.HTTP_201_CREATED
                if created else status.HTTP_200_OK
            )
        )

    def patch(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response(
                {"message": "Create your profile first."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Availability-only update
        if set(request.data.keys()) == {"is_available"}:
            value = request.data["is_available"]

            if not isinstance(value, bool):
                return Response(
                    {"message": "is_available must be true or false."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            profile.is_available = value
            profile.save(update_fields=["is_available", "updated_at"])

            return Response({
                "message": "Availability updated.",
                "is_available": profile.is_available,
            })

        data = request.data.copy()
        skill_names = data.pop("skills", None)

        if skill_names is not None:
            if not isinstance(skill_names, list) or any(
                not isinstance(name, str) or not name.strip()
                for name in skill_names
            ):
                return Response(
                    {"message": "Invalid skills list."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        serializer = ProfileSerializer(
            profile,
            data=data,
            partial=True
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            serializer.save()

            if skill_names is not None:
                self.save_skills(request.user, skill_names)

        return Response({
            "message": "Profile updated successfully."
        })

    @staticmethod
    def save_skills(user, skill_names):
        # Remove old student-skill links, not the shared Skill records.
        StudentSkill.objects.filter(student=user).delete()

        for name in dict.fromkeys(
            name.strip() for name in skill_names
        ):
            skill, _ = Skill.objects.get_or_create(name=name)

            StudentSkill.objects.get_or_create(
                student=user,
                skill=skill,
                defaults={"percentage": 0}
            )
