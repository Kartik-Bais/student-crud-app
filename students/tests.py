from django.test import TestCase
from rest_framework.test import APIClient
from .models import Student

class StudentAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = Student.objects.create(
            name="Asha Sharma",
            email="asha@example.com",
            course="Computer Science",
        )

    def test_list_students(self):
        response = self.client.get("/api/students/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_student(self):
        response = self.client.post("/api/students/", {
            "name": "Rahul Verma",
            "email": "rahul@example.com",
            "course": "Information Technology",
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Student.objects.count(), 2)

    def test_update_student(self):
        response = self.client.patch(
            f"/api/students/{self.student.id}/",
            {"course": "Data Science"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.student.refresh_from_db()
        self.assertEqual(self.student.course, "Data Science")

    def test_delete_student(self):
        response = self.client.delete(f"/api/students/{self.student.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Student.objects.filter(id=self.student.id).exists())
