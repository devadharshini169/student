from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import date

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Student Attendance System Backend is Running"
    }

@app.post("/students")
def add_student(register_no: str, name: str, department: str):
    connection = sqlite3.connect("attendance.db")
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO students (register_no, name, department)
        VALUES (?, ?, ?)
        """,
        (register_no, name, department)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Student added successfully"
    }

@app.get("/students")
def get_students():
    connection = sqlite3.connect("attendance.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM students")
    students = cursor.fetchall()

    connection.close()

    return students

@app.post("/attendance")
def mark_attendance(student_id: int, status: str):
    connection = sqlite3.connect("attendance.db")
    cursor = connection.cursor()

    today = str(date.today())

    cursor.execute(
        """
        INSERT INTO attendance (student_id, date, status)
        VALUES (?, ?, ?)
        """,
        (student_id, today, status)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Attendance marked successfully"
    }

@app.get("/attendance")
def get_attendance():
    connection = sqlite3.connect("attendance.db")
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            attendance.id,
            students.register_no,
            students.name,
            attendance.date,
            attendance.status
        FROM attendance
        JOIN students
        ON attendance.student_id = students.id
        ORDER BY attendance.id DESC
    """)

    attendance = cursor.fetchall()

    connection.close()

    return attendance