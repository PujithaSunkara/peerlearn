
from django.contrib import admin
from django.urls import path

from accounts.views import (
    RegisterView,
    LoginView,
    VerifyOTPView,
    ResendOTPView,
)

from rest_framework_simplejwt.views import TokenRefreshView

from profiles.views import ProfileView

from skills.views import (
    GenerateSkillQuizView,
    SubmitSkillQuizView,
    SkillScoresView,
)

from learning.views import CreateVideoRoomView,AgoraTokenView


urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("auth/resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User profile
    path("auth/profile/", ProfileView.as_view(), name="profile"),

    path(
        "auth/skill-quiz/",
        GenerateSkillQuizView.as_view(),
        name="skill-quiz",
    ),
    path(
        "auth/skill-quiz/submit/",
        SubmitSkillQuizView.as_view(),
        name="submit-quiz-submit",
    ),
    path(
        "auth/skill-scores/",
        SkillScoresView.as_view(),
        name="skill-scores",
    ),
    path(
        "auth/agora/rooms/create/",
        CreateVideoRoomView.as_view(),
        name="create-video-room",
    ),
    path(
        "auth/agora/token/",
        AgoraTokenView.as_view(),
        name="agora-token",
    ),
]
