import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://student-w8sd.onrender.com";

function App() {
  const [page, setPage] = useState("dashboard");

  const [registerNo, setRegisterNo] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");

  // Load data
  useEffect(() => {
    getStudents();
    getAttendance();
  }, []);

  const getStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      const data = await response.json();
      setStudents(data);
    } catch {
      setMessage("Unable to connect to backend");
    }
  };

  const getAttendance = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance`);
      const data = await response.json();
      setAttendance(data);
    } catch {
      setMessage("Unable to load attendance");
    }
  };

  // Add student
  const addStudent = async () => {
    if (!registerNo.trim()) {
      setMessage("⚠️ Please enter Register Number");
      return;
    }

    if (!name.trim()) {
      setMessage("⚠️ Please enter Student Name");
      return;
    }

    if (!department) {
      setMessage("⚠️ Please select Department");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students?register_no=${encodeURIComponent(
          registerNo
        )}&name=${encodeURIComponent(name)}&department=${encodeURIComponent(
          department
        )}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setMessage("✅ " + data.message);

      setRegisterNo("");
      setName("");
      setDepartment("");

      getStudents();
      setPage("students");
    } catch {
      setMessage("❌ Unable to connect to backend");
    }
  };

  // Mark attendance
  const markAttendance = async (studentId, status) => {
    try {
      const response = await fetch(
        `${API_URL}/attendance?student_id=${studentId}&status=${status}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setMessage(
        status === "Present"
          ? "✅ Attendance marked as Present"
          : "❌ Attendance marked as Absent"
      );

      getAttendance();
    } catch {
      setMessage("Unable to connect to backend");
    }
  };

  const presentCount = attendance.filter(
    (record) => record[4] === "Present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record[4] === "Absent"
  ).length;

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          🎓 <span>Attendify</span>
        </div>

        <div className="nav-buttons">
          <button
            className={page === "dashboard" ? "nav-active" : ""}
            onClick={() => setPage("dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            className={page === "students" ? "nav-active" : ""}
            onClick={() => setPage("students")}
          >
            👨‍🎓 Students
          </button>

          <button
            className={page === "attendance" ? "nav-active" : ""}
            onClick={() => setPage("attendance")}
          >
            📋 Attendance
          </button>
        </div>
      </nav>

      <main className="main-container">

        {/* Message */}
        {message && (
          <div className="message-box">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {/* ================= DASHBOARD ================= */}
        {page === "dashboard" && (
          <section className="page">

            <div className="hero">
              <div>
                <p className="small-title">STUDENT MANAGEMENT SYSTEM</p>
                <h1>Attendance Dashboard</h1>
                <p>
                  Manage students and track attendance easily.
                </p>
              </div>

              <div className="hero-icon">📊</div>
            </div>

            <div className="stats-grid">

              <div className="stat-card total-card">
                <div className="stat-icon">👨‍🎓</div>
                <div>
                  <p>Total Students</p>
                  <h2>{students.length}</h2>
                </div>
              </div>

              <div className="stat-card present-card">
                <div className="stat-icon">✓</div>
                <div>
                  <p>Present</p>
                  <h2>{presentCount}</h2>
                </div>
              </div>

              <div className="stat-card absent-card">
                <div className="stat-icon">✕</div>
                <div>
                  <p>Absent</p>
                  <h2>{absentCount}</h2>
                </div>
              </div>

            </div>

            <div className="dashboard-card">
              <h2>Quick Actions</h2>
              <p>Select an option to continue.</p>

              <div className="quick-actions">
                <button onClick={() => setPage("students")}>
                  👨‍🎓 Manage Students
                </button>

                <button onClick={() => setPage("attendance")}>
                  📋 Mark Attendance
                </button>
              </div>
            </div>

          </section>
        )}

        {/* ================= STUDENTS ================= */}
        {page === "students" && (
          <section className="page">

            <div className="page-title">
              <p className="small-title">STUDENT MANAGEMENT</p>
              <h1>Students</h1>
              <p>Add and view student details.</p>
            </div>

            {/* Add Student */}
            <div className="glass-card">

              <h2>➕ Add Student</h2>
              <p className="card-description">
                Enter all student details.
              </p>

              <div className="student-form">

                <div className="input-group">
                  <label>Register Number</label>
                  <input
                    type="text"
                    placeholder="Example: 23CS101"
                    value={registerNo}
                    onChange={(e) => setRegisterNo(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Student Name</label>
                  <input
                    type="text"
                    placeholder="Enter student name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Department</label>

                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="IT">IT</option>
                    <option value="AI & DS">AI & DS</option>
                    <option value="AI & ML">AI & ML</option>
                  </select>
                </div>

              </div>

              <button className="add-button" onClick={addStudent}>
                + Add Student
              </button>

            </div>

            {/* Student List */}
            <div className="glass-card">

              <div className="card-heading">
                <div>
                  <h2>👨‍🎓 Student List</h2>
                  <p className="card-description">
                    Registered students
                  </p>
                </div>

                <button
                  className="refresh-button"
                  onClick={getStudents}
                >
                  ↻ Refresh
                </button>
              </div>

              {students.length === 0 ? (
                <div className="empty-state">
                  No students found.
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Register No</th>
                        <th>Name</th>
                        <th>Department</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr key={student[0]}>
                          <td>{student[1]}</td>
                          <td>{student[2]}</td>
                          <td>
                            <span className="department-badge">
                              {student[3]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </section>
        )}

        {/* ================= ATTENDANCE ================= */}
        {page === "attendance" && (
          <section className="page">

            <div className="page-title">
              <p className="small-title">ATTENDANCE MANAGEMENT</p>
              <h1>Mark Attendance</h1>
              <p>Mark students as present or absent.</p>
            </div>

            <div className="glass-card">

              <div className="card-heading">
                <div>
                  <h2>📋 Today's Attendance</h2>
                  <p className="card-description">
                    Select Present or Absent for each student.
                  </p>
                </div>

                <button
                  className="refresh-button"
                  onClick={getStudents}
                >
                  ↻ Refresh
                </button>
              </div>

              {students.length === 0 ? (
                <div className="empty-state">
                  No students available. Add students first.
                </div>
              ) : (
                <div className="table-container">

                  <table>
                    <thead>
                      <tr>
                        <th>Register No</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Mark Attendance</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr key={student[0]}>
                          <td>{student[1]}</td>
                          <td>{student[2]}</td>
                          <td>{student[3]}</td>

                          <td>
                            <button
                              className="present-button"
                              onClick={() =>
                                markAttendance(
                                  student[0],
                                  "Present"
                                )
                              }
                            >
                              ✓ Present
                            </button>

                            <button
                              className="absent-button"
                              onClick={() =>
                                markAttendance(
                                  student[0],
                                  "Absent"
                                )
                              }
                            >
                              ✕ Absent
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              )}

            </div>

            {/* Attendance History */}
            <div className="glass-card">

              <div className="card-heading">
                <div>
                  <h2>📜 Attendance History</h2>
                  <p className="card-description">
                    Previous attendance records
                  </p>
                </div>

                <button
                  className="refresh-button"
                  onClick={getAttendance}
                >
                  ↻ Refresh
                </button>
              </div>

              {attendance.length === 0 ? (
                <div className="empty-state">
                  No attendance records found.
                </div>
              ) : (
                <div className="table-container">

                  <table>
                    <thead>
                      <tr>
                        <th>Register No</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendance.map((record) => (
                        <tr key={record[0]}>
                          <td>{record[1]}</td>
                          <td>{record[2]}</td>
                          <td>{record[3]}</td>
                          <td>
                            <span
                              className={
                                record[4] === "Present"
                                  ? "status-present"
                                  : "status-absent"
                              }
                            >
                              {record[4]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              )}

            </div>

          </section>
        )}

      </main>

      <footer>
        Student Attendance System • React + FastAPI + SQLite
      </footer>

    </div>
  );
}

export default App;