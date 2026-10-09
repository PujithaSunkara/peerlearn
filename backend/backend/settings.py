
"""
Django settings for backend project.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ==========================================
# BASE DIRECTORY
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Load local .env file when present.
# On Render, configure environment variables in the dashboard.
load_dotenv(BASE_DIR / ".env")


# ==========================================
# SECURITY
# ==========================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-local-development-only-change-this"
)

DEBUG = os.getenv("DEBUG", "True").lower() == "true"

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "peerlearn-4.onrender.com",
]


# ==========================================
# TWILIO
# ==========================================

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_API_KEY = os.getenv("TWILIO_API_KEY", "")
TWILIO_API_SECRET = os.getenv("TWILIO_API_SECRET", "")
TWILIO_VERIFY_SERVICE_SID = os.getenv(
    "TWILIO_VERIFY_SERVICE_SID", ""
)


# ==========================================
# AGORA
# ==========================================

AGORA_APP_ID = os.getenv("AGORA_APP_ID", "")
AGORA_APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE", "")


# ==========================================
# APPLICATIONS
# ==========================================

INSTALLED_APPS = [
    # Django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party apps
    "rest_framework",
    "corsheaders",

    # Project apps
    "accounts",
    "assessments",
    "doubts",
    "matching",
    "profiles",
    "reviews",
    "skills",
    "learning",
]


# ==========================================
# MIDDLEWARE
# ==========================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ==========================================
# URL CONFIGURATION
# ==========================================

ROOT_URLCONF = "backend.urls"

WSGI_APPLICATION = "backend.wsgi.application"


# ==========================================
# TEMPLATES
# ==========================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ==========================================
# CUSTOM USER
# ==========================================

AUTH_USER_MODEL = "accounts.User"


# ==========================================
# REST FRAMEWORK
# ==========================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}


# ==========================================
# CORS
# ==========================================

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://peerlearn-gamma.vercel.app",
]
CORS_ALLOW_CREDENTIALS = True


# ==========================================
# SESSION AND CSRF COOKIES
# ==========================================

SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

# Configure this if your frontend uses Django session/CSRF
# authentication across origins. JWT-only APIs may not need it.
CSRF_TRUSTED_ORIGINS = [
    "https://peerlearn-gamma.vercel.app",
]


# ==========================================
# DATABASE
# ==========================================
# Keeps SQLite for local development.
# Configure a persistent production database before launch.

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ==========================================
# PASSWORD VALIDATION
# ==========================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ==========================================
# INTERNATIONALIZATION
# ==========================================

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# ==========================================
# STATIC FILES
# ==========================================

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"


# ==========================================
# EMAIL
# ==========================================

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    EMAIL_HOST_USER
)


# ==========================================
# DEFAULT PRIMARY KEY
# ==========================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ==========================================
# PRODUCTION SECURITY
# ==========================================

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SESSION_COOKIE_HTTPONLY = True
