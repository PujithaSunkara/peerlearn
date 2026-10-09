
from django.core.cache import cache
from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Skill, StudentSkill
from .quiz_generator import generate_quiz


QUIZ_TIMEOUT = 30 * 60


def get_quiz_cache_key(user_id):
    return f"skill_quiz:{user_id}"


def get_result_cache_key(user_id):
    return f"skill_quiz_result:{user_id}"


class GenerateSkillQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_skills = request.data.get("skills", [])

        if not isinstance(user_skills, list) or not user_skills:
            return Response(
                {
                    "success": False,
                    "message": "Please provide your skills as a non-empty list.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = generate_quiz(user_skills, count=10)

        if not result.get("success"):
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        answer_key = result.pop("answer_key", None)
        questions = result.get("questions", [])

        if not isinstance(answer_key, dict) or not questions:
            return Response(
                {
                    "success": False,
                    "message": "Quiz generation returned invalid data.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        answer_key = {
            str(question_id): answer
            for question_id, answer in answer_key.items()
        }

        cache.set(
            get_quiz_cache_key(request.user.pk),
            {
                "answer_key": answer_key,
                "questions": questions,
            },
            timeout=QUIZ_TIMEOUT,
        )

        cache.delete(get_result_cache_key(request.user.pk))

        return Response(result, status=status.HTTP_200_OK)


class SubmitSkillQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        quiz_data = cache.get(get_quiz_cache_key(user.pk))

        if not quiz_data:
            return Response(
                {
                    "success": False,
                    "message": (
                        "No active quiz found or the quiz expired. "
                        "Please start a new quiz."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        answer_key = quiz_data.get("answer_key", {})
        questions = quiz_data.get("questions", [])

        if not answer_key or not questions:
            return Response(
                {
                    "success": False,
                    "message": "Invalid quiz data. Please start a new quiz.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        answers = request.data.get("answers")

        if not isinstance(answers, dict):
            return Response(
                {
                    "success": False,
                    "message": "Answers must be provided as an object.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        answers = {
            str(question_id): answer
            for question_id, answer in answers.items()
        }

        expected_ids = {str(question["id"]) for question in questions}

        if set(answers.keys()) != expected_ids:
            return Response(
                {
                    "success": False,
                    "message": (
                        f"Please submit answers for all {len(questions)} questions."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        for question in questions:
            question_id = str(question["id"])

            if answers[question_id] not in question.get("options", []):
                return Response(
                    {
                        "success": False,
                        "message": f"Invalid option for question {question_id}.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if question_id not in answer_key:
                return Response(
                    {
                        "success": False,
                        "message": "Answer key is incomplete. Please start a new quiz.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Calculate correct answers for each assessed skill.
        skill_results = {}

        for question in questions:
            question_id = str(question["id"])
            skill_name = question["skill"]

            if skill_name not in skill_results:
                skill_results[skill_name] = {
                    "skill": skill_name,
                    "total": 0,
                    "correct": 0,
                }

            skill_results[skill_name]["total"] += 1

            if answers[question_id] == answer_key[question_id]:
                skill_results[skill_name]["correct"] += 1

        results = []

        # Save each assessed skill's percentage to the database.
        for item in skill_results.values():
            percentage = round(
                item["correct"] / item["total"] * 100
            )

            skill_object, _ = Skill.objects.get_or_create(
                name=item["skill"]
            )

            StudentSkill.objects.update_or_create(
                student=user,
                skill=skill_object,
                defaults={
                    "percentage": Decimal(str(percentage))
                },
            )

            results.append({
                **item,
                "percentage": percentage,
            })

        total_questions = len(questions)
        total_correct = sum(item["correct"] for item in results)

        overall_percentage = round(
            total_correct / total_questions * 100
        )

        quiz_result = {
            "success": True,
            "totalQuestions": total_questions,
            "totalCorrect": total_correct,
            "overallPercentage": overall_percentage,
            "skillResults": results,
        }

        # Keep a temporary copy for the result screen / score endpoint.
        cache.set(
            get_result_cache_key(user.pk),
            quiz_result,
            timeout=QUIZ_TIMEOUT,
        )

        # Prevent submitting the same quiz a second time.
        cache.delete(get_quiz_cache_key(user.pk))

        return Response(quiz_result, status=status.HTTP_200_OK)


class SkillScoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Read persisted scores from the database, not just the cache.
        student_skills = (
            StudentSkill.objects
            .filter(student=request.user)
            .select_related("skill")
            .order_by("skill__name")
        )

        skills = [
            {
                "name": item.skill.name,
                "percentage": float(item.percentage),
            }
            for item in student_skills
        ]

        return Response(
            {
                "success": True,
                "skills": skills,
            },
            status=status.HTTP_200_OK,
        )
