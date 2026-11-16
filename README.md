# Student CRUD App — Django REST Framework + React

A full-stack Student Management CRUD application featuring a Django REST Framework backend with SQLite and a modern React.js frontend.

---

## 🚀 Features

- **Full CRUD operations**: Create, Read, Update, and Delete student records.
- **RESTful API**: Built with Django REST Framework (DRF) and ModelSerializers.
- **CORS enabled**: `django-cors-headers` configured for seamless local frontend-backend integration.
- **Modern React UI**:
  - Live search & filter across names, emails, and courses.
  - Interactive forms for adding and editing students.
  - Real-time feedback alerts & responsive design.
- **SQLite Database**: Out-of-the-box relational SQL storage with automated migrations.

---

## 🛠️ Project Structure

```text
crud-django/
├── config/             # Django project settings and root routing
├── students/           # Django app: models, views, serializers, urls, migrations
├── frontend/           # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── App.js      # Student CRUD component
│   │   ├── App.css     # Clean responsive styling
│   │   └── index.js
│   └── package.json
├── db.sqlite3          # Local database
├── manage.py
├── requirements.txt    # Python dependencies
└── README.md
```

---

## 📦 Getting Started

### 1. Backend Setup (Django)

In your terminal:

```powershell
# Create & activate a virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations students
python manage.py migrate

# Start the Django server
python manage.py runserver 127.0.0.1:8000
```

The API will be accessible at:
- **API Root**: `http://127.0.0.1:8000/api/students/`
- **Admin Panel**: `http://127.0.0.1:8000/admin/`

---

### 2. Frontend Setup (React)

Open a second terminal window:

```powershell
cd frontend

# Install npm packages
npm install

# Start React development server
npm start
```

The React portal will open at `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students/` | List all enrolled students |
| `POST` | `/api/students/` | Add a new student |
| `GET` | `/api/students/<id>/` | Retrieve student details |
| `PUT` | `/api/students/<id>/` | Update entire student record |
| `PATCH` | `/api/students/<id>/` | Partially update student record |
| `DELETE` | `/api/students/<id>/` | Delete student record |
