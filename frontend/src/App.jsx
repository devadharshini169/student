import { useState } from "react";

function App() {
  const [registerNo, setRegisterNo] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");

  // Add Student
  const addStudent = async () => {
    if (!registerNo || !name || !department) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/students?register_no=${encodeURIComponent(
          registerNo
        )}&name=${encodeURIComponent(name)}&department=${encodeURIComponent(
          department
        )}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      setRegisterNo("");
      setName("");
      setDepartment("");

      getStudents();
    } catch (error) {
      setMessage("Unable to connect to backend");
    }
  };

  // Get Students
  const getStudents = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/students"
      );

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      setMessage("Unable to connect to backend");
    }
  };

  // Mark Attendance
  const markAttendance = async (studentId, status) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/attendance?student_id=${studentId}&status=${status}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      // Refresh attendance automatically
      getAttendance();
    } catch (error) {
      setMessage("Unable to connect to backend");
    }
  };

  // Get Attendance
  const getAttendance = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/attendance"
      );

      const data = await response.json();

      setAttendance(data);
    } catch (error) {
      setMessage("Unable to load attendance records");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1>Student Attendance System</h1>

        {/* Add Student */}
        <h2>Add Student</h2>

        <input
          type="text"
          placeholder="Register Number"
          value={registerNo}
          onChange={(e) => setRegisterNo(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={addStudent}
          style={styles.button}
        >
          Add Student
        </button>

        <button
          onClick={getStudents}
          style={styles.button}
        >
          View Students
        </button>

        <button
          onClick={getAttendance}
          style={styles.button}
        >
          View Attendance
        </button>

        <p style={styles.message}>
          {message}
        </p>

        {/* Students */}
        <h2>Students</h2>

        {students.length === 0 ? (
          <p>No students found</p>
        ) : (
          students.map((student) => (
            <div
              key={student[0]}
              style={styles.student}
            >
              <p>
                <b>Register No:</b> {student[1]}
              </p>

              <p>
                <b>Name:</b> {student[2]}
              </p>

              <p>
                <b>Department:</b> {student[3]}
              </p>

              <button
                onClick={() =>
                  markAttendance(student[0], "Present")
                }
                style={styles.presentButton}
              >
                Present
              </button>

              <button
                onClick={() =>
                  markAttendance(student[0], "Absent")
                }
                style={styles.absentButton}
              >
                Absent
              </button>

              <hr />
            </div>
          ))
        )}

        {/* Attendance Records */}
        <h2>Attendance Records</h2>

        {attendance.length === 0 ? (
          <p>No attendance records found</p>
        ) : (
          attendance.map((record) => (
            <div
              key={record[0]}
              style={styles.attendance}
            >
              <p>
                <b>Register No:</b> {record[1]}
              </p>

              <p>
                <b>Name:</b> {record[2]}
              </p>

              <p>
                <b>Date:</b> {record[3]}
              </p>

              <p>
                <b>Status:</b> {record[4]}
              </p>

              <hr />
            </div>
          ))
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    paddingTop: "30px",
    paddingBottom: "30px",
  },

  card: {
    width: "500px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "90%",
    padding: "12px",
    margin: "8px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "10px 20px",
    margin: "8px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },

  presentButton: {
    padding: "8px 15px",
    marginRight: "5px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "green",
    color: "white",
    cursor: "pointer",
  },

  absentButton: {
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "red",
    color: "white",
    cursor: "pointer",
  },

  student: {
    textAlign: "left",
    padding: "10px",
  },

  attendance: {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#f8f8f8",
    marginBottom: "10px",
    borderRadius: "5px",
  },

  message: {
    fontSize: "16px",
    color: "#555",
  },
};

export default App;