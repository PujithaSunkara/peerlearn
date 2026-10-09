from datetime import datetime
import random

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import RegisterSerializer


# =========================================================
# GENERATE OTP
# =========================================================

def generate_otp():
    return str(random.randint(100000, 999999))


# =========================================================
# SEND OTP EMAIL
# =========================================================

def send_otp_email(email, otp):

    send_mail(
        "PeerLearn Email Verification",

        f"""
Hello,

Your PeerLearn verification OTP is:

{otp}

This OTP is valid for 5 minutes.

Thank you,
PeerLearn
""",

        None,

        [email],

        fail_silently=False
    )


# =========================================================
# REGISTER
# =========================================================
#
# IMPORTANT:
#
# This function DOES NOT create the user.
#
# It only:
#
# 1. Checks the registration data
# 2. Generates OTP
# 3. Stores registration data in session
# 4. Stores OTP in session
# 5. Sends OTP email
#
# User is created ONLY after OTP verification.
#
# =========================================================

class RegisterView(APIView):

    def post(self, request):

        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        # -------------------------------------------------
        # Validate fields
        # -------------------------------------------------

        if not username or not email or not password:

            return Response(
                {
                    "message": "All fields are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Check email
        # -------------------------------------------------

        if User.objects.filter(email=email).exists():

            return Response(
                {
                    "message": "Email is already registered."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Check username
        # -------------------------------------------------

        if User.objects.filter(username=username).exists():

            return Response(
                {
                    "message": "Username already exists."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Generate OTP
        # -------------------------------------------------

        otp = generate_otp()

        # -------------------------------------------------
        # Store registration data in session
        # -------------------------------------------------

        request.session["registration_data"] = {

            "username": username,

            "email": email,

            # Store hashed password temporarily
            "password": make_password(password)

        }

        # -------------------------------------------------
        # Store OTP
        # -------------------------------------------------

        request.session["registration_otp"] = otp

        # -------------------------------------------------
        # Store OTP creation time
        # -------------------------------------------------

        request.session["otp_created_at"] = (
            timezone.now().isoformat()
        )

        # Make sure Django saves the session
        request.session.modified = True

        # -------------------------------------------------
        # DEBUG
        # -------------------------------------------------

        print("--------------------------------")
        print("REGISTER SESSION")
        print("Session ID:", request.session.session_key)
        print("OTP:", request.session.get("registration_otp"))
        print("Registration data:",
              request.session.get("registration_data"))
        print("--------------------------------")

        # -------------------------------------------------
        # Send OTP email
        # -------------------------------------------------

        try:

            send_otp_email(
                email,
                otp
            )

        except Exception as error:

            print("EMAIL ERROR:", error)

            return Response(
                {
                    "message": "Could not send OTP email."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return Response(
            {
                "message":
                    "OTP sent to your email. "
                    "Verify your email to complete registration."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# VERIFY OTP
# =========================================================
#
# USER IS CREATED ONLY HERE.
#
# =========================================================

class VerifyOTPView(APIView):

    def post(self, request):

        entered_otp = request.data.get("otp")

        # -------------------------------------------------
        # Validate OTP
        # -------------------------------------------------

        if not entered_otp:

            return Response(
                {
                    "message": "OTP is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Get registration data from session
        # -------------------------------------------------

        registration_data = request.session.get(
            "registration_data"
        )

        saved_otp = request.session.get(
            "registration_otp"
        )

        otp_created_at = request.session.get(
            "otp_created_at"
        )

        # -------------------------------------------------
        # DEBUG
        # -------------------------------------------------

        print("--------------------------------")
        print("VERIFY SESSION")
        print("Session ID:", request.session.session_key)
        print("Saved OTP:", saved_otp)
        print("Registration data:", registration_data)
        print("OTP created at:", otp_created_at)
        print("Entered OTP:", entered_otp)
        print("--------------------------------")

        # -------------------------------------------------
        # Check session
        # -------------------------------------------------

        if (
            not registration_data
            or not saved_otp
            or not otp_created_at
        ):

            return Response(
                {
                    "message":
                        "Registration session expired. "
                        "Please register again."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Convert stored timestamp
        # -------------------------------------------------

        try:

            created_time = datetime.fromisoformat(
                otp_created_at
            )

        except (ValueError, TypeError):

            return Response(
                {
                    "message":
                        "Invalid OTP session. "
                        "Please register again."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Make timezone aware
        # -------------------------------------------------

        if timezone.is_naive(created_time):

            created_time = timezone.make_aware(
                created_time
            )

        # -------------------------------------------------
        # Check OTP expiration
        # -------------------------------------------------

        elapsed = (
            timezone.now() - created_time
        ).total_seconds()

        if elapsed > 300:

            return Response(
                {
                    "message":
                        "OTP expired. Please resend OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Check OTP
        # -------------------------------------------------

        if str(entered_otp) != str(saved_otp):

            return Response(
                {
                    "message": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # OTP IS CORRECT
        # NOW CREATE USER
        # =================================================

        data = {

            "username":
                registration_data["username"],

            "email":
                registration_data["email"],

            "password":
                registration_data["password"],

            "is_verified":
                True

        }

        # -------------------------------------------------
        # Serializer
        # -------------------------------------------------

        serializer = RegisterSerializer(
            data=data
        )

        # -------------------------------------------------
        # Validate serializer
        # -------------------------------------------------

        if not serializer.is_valid():

            print(
                "SERIALIZER ERRORS:",
                serializer.errors
            )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # CREATE USER
        # -------------------------------------------------

        user = serializer.save()

        # -------------------------------------------------
        # Mark verified
        # -------------------------------------------------

        user.is_verified = True

        user.save()

        # -------------------------------------------------
        # Generate JWT
        # -------------------------------------------------

        refresh = RefreshToken.for_user(user)

        access_token = str(
            refresh.access_token
        )

        refresh_token = str(
            refresh
        )

        # -------------------------------------------------
        # Clear registration session
        # -------------------------------------------------

        request.session.pop(
            "registration_data",
            None
        )

        request.session.pop(
            "registration_otp",
            None
        )

        request.session.pop(
            "otp_created_at",
            None
        )

        request.session.modified = True

        # -------------------------------------------------
        # Success
        # -------------------------------------------------

        return Response(
            {
                "message":
                    "Registration successful!",

                "access":
                    access_token,

                "refresh":
                    refresh_token
            },

            status=status.HTTP_201_CREATED
        )


# =========================================================
# RESEND OTP
# =========================================================

class ResendOTPView(APIView):

    def post(self, request):

        # -------------------------------------------------
        # Get registration data
        # -------------------------------------------------

        registration_data = request.session.get(
            "registration_data"
        )

        # -------------------------------------------------
        # Check session
        # -------------------------------------------------

        if not registration_data:

            return Response(
                {
                    "message":
                        "Registration session expired. "
                        "Please register again."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Generate new OTP
        # -------------------------------------------------

        otp = generate_otp()

        # -------------------------------------------------
        # Store new OTP
        # -------------------------------------------------

        request.session["registration_otp"] = otp

        request.session["otp_created_at"] = (
            timezone.now().isoformat()
        )

        request.session.modified = True

        # -------------------------------------------------
        # DEBUG
        # -------------------------------------------------

        print("--------------------------------")
        print("RESEND OTP")
        print("Session ID:", request.session.session_key)
        print("New OTP:", otp)
        print("--------------------------------")

        # -------------------------------------------------
        # Send OTP
        # -------------------------------------------------

        try:

            send_otp_email(
                registration_data["email"],
                otp
            )

        except Exception as error:

            print("EMAIL ERROR:", error)

            return Response(
                {
                    "message":
                        "Could not send OTP email."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return Response(
            {
                "message":
                    "New OTP sent to your email."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# LOGIN
# =========================================================

class LoginView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        # -------------------------------------------------
        # Validate fields
        # -------------------------------------------------

        if not email or not password:

            return Response(
                {
                    "message":
                        "Email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Find user
        # -------------------------------------------------

        try:

            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            return Response(
                {
                    "message":
                        "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # -------------------------------------------------
        # Authenticate
        # -------------------------------------------------

        user = authenticate(
            username=user.username,
            password=password
        )

        # -------------------------------------------------
        # Invalid password
        # -------------------------------------------------

        if user is None:

            return Response(
                {
                    "message":
                        "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # -------------------------------------------------
        # Check email verification
        # -------------------------------------------------

        if not user.is_verified:

            return Response(
                {
                    "message":
                        "Please verify your email before logging in."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # Generate JWT
        # -------------------------------------------------

        refresh = RefreshToken.for_user(user)

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return Response(
            {
                "message":
                    "Login successful.",

                "access":
                    str(refresh.access_token),

                "refresh":
                    str(refresh)
            },

            status=status.HTTP_200_OK
        )