import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api/students/';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch students (${res.status})`);
      }
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to backend API. Please make sure the Django server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', course: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.course.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setFormLoading(true);
    setError('');

    const url = editingId ? `${API_BASE_URL}${editingId}/` : API_BASE_URL;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        const errorDetails = Object.entries(responseData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        throw new Error(errorDetails || 'Failed to save student.');
      }

      showNotification(editingId ? 'Student updated successfully!' : 'Student added successfully!');
      handleCancelEdit();
      fetchStudents();
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok && res.status !== 204) {
        throw new Error('Failed to delete student.');
      }

      showNotification('Student deleted successfully!');
      if (editingId === id) {
        handleCancelEdit();
      }
      fetchStudents();
    } catch (err) {
      console.error(err);
      setError('Failed to delete student. Please try again.');
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container">
      <header className="header">
        <h1>Student Management Portal</h1>
        <p className="subtitle">Django REST Framework + React Full-Stack Application</p>
      </header>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid">
        {/* Form Card */}
        <section className="card form-card">
          <h2>{editingId ? 'Edit Student Details' : 'Register New Student'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. jane@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Course / Department</label>
              <input
                id="course"
                name="course"
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.course}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? 'Saving...' : editingId ? 'Update Student' : 'Add Student'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={formLoading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* List Card */}
        <section className="card list-card">
          <div className="list-header">
            <div>
              <h2>Enrolled Students</h2>
              <span className="badge">{students.length} total</span>
            </div>
            <button className="btn btn-refresh" onClick={fetchStudents} title="Reload Data">
              Refresh
            </button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="status-text">Loading student records...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              {students.length === 0
                ? 'No students enrolled yet. Add one using the form on the left!'
                : 'No students match your search filter.'}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, index) => (
                    <tr key={s.id}>
                      <td>{index + 1}</td>
                      <td className="font-semibold">{s.name}</td>
                      <td>{s.email}</td>
                      <td>
                        <span className="course-tag">{s.course}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEditClick(s)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDelete(s.id, s.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
