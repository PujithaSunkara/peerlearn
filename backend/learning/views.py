from django.shortcuts import render

# Create your views here.

import secrets

from django.conf import settings
from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import VideoRoom

from agora_token.src.RtcTokenBuilder2 import (
    RtcTokenBuilder,
    Role_Publisher,
)


class CreateVideoRoomView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room = VideoRoom.objects.create(
            room_id=secrets.token_urlsafe(12),
            created_by=request.user,
        )

        return Response(
            {"success": True, "room_id": room.room_id},
            status=status.HTTP_201_CREATED,
        )


class AgoraTokenView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_id = str(request.data.get("room_id", "")).strip()

        if not room_id or len(room_id) > 64:
            return Response(
                {"error": "Invalid room ID."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not settings.AGORA_APP_ID or not settings.AGORA_APP_CERTIFICATE:
            return Response(
                {"error": "Agora credentials are not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            with transaction.atomic():
                room = VideoRoom.objects.select_for_update().get(
                    room_id=room_id,
                    is_active=True,
                )

                if room.created_by_id != request.user.pk:
                    if room.participant_id == request.user.pk:
                        pass
                    elif room.participant_id is None:
                        room.participant = request.user
                        room.save(update_fields=["participant"])
                    else:
                        return Response(
                            {"error": "This room already has two participants."},
                            status=status.HTTP_403_FORBIDDEN,
                        )

        except VideoRoom.DoesNotExist:
            return Response(
                {"error": "Room not found or inactive."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            uid = int(request.user.pk)
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid user ID for Agora."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not 1 <= uid <= 4294967295:
            return Response(
                {"error": "User ID is outside the supported Agora UID range."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = RtcTokenBuilder.build_token_with_uid(
            settings.AGORA_APP_ID,
            settings.AGORA_APP_CERTIFICATE,
            room.room_id,
            uid,
            Role_Publisher,
            3600,
            3600,
        )

        return Response({
            "success": True,
            "app_id": settings.AGORA_APP_ID,
            "channel": room.room_id,
            "uid": uid,
            "token": token,
        })
