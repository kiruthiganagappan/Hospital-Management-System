# Hospital Management System

A full-stack Hospital Management System built with **React (Vite)** on the frontend and
**Django + Django REST Framework + MySQL** on the backend, with JWT authentication and
three user roles: **Admin**, **Doctor**, and **Patient**.

This project has been end-to-end tested (registration, login, doctor/patient/department
creation, appointment booking with double-booking prevention, consultations, prescriptions,
dashboards, and the complete patient history view) using Django's test client before being
packaged, and the frontend has been verified to build cleanly with Vite.

---

## Tech Stack

**Frontend:** React 18, Vite, React Router DOM, Axios
**Backend:** Python, Django 5, Django REST Framework, Simple JWT
**Database:** MySQL

---

## Project Structure

```text
hospital-management-system/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/            # settings, urls, wsgi/asgi
│   ├── accounts/          # custom user model, auth, permissions
│   ├── departments/
│   ├── doctors/
│   ├── patients/
│   ├── appointments/
│   ├── medical_records/   # medical records + prescriptions
│   └── dashboard/         # role-based dashboard stats
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/
        ├── pages/{auth,admin,doctor,patient}/
        ├── services/
        ├── context/
        ├── routes/
        └── styles/
```

---

## 1. Backend Setup

### 1.1 Create a virtual environment

```bash
cd backend
python -m venv venv
```

Activate it:

- **Windows:** `venv\Scripts\activate`
- **macOS / Linux:** `source venv/bin/activate`

### 1.2 Install dependencies

```bash
pip install -r requirements.txt
```

> `mysqlclient` requires MySQL's development headers to build. On Ubuntu/Debian:
> `sudo apt-get install default-libmysqlclient-dev build-essential pkg-config`
> On macOS: `brew install mysql-client pkg-config`

### 1.3 Create the MySQL database

```sql
CREATE DATABASE hospital_db CHARACTER SET utf8mb4;
```

### 1.4 Configure environment variables

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```bash
cp .env.example .env
```

```text
SECRET_KEY=django-insecure-change-this-key-in-production
DEBUG=True
DB_NAME=hospital_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

### 1.5 Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 1.6 Create an admin user

```bash
python manage.py createsuperuser
```

After creating the superuser, open the Django admin at `http://127.0.0.1:8000/admin/`,
find the user you just created under **Accounts → Users**, and set its **role** field to
`ADMIN` (superusers are not automatically given the ADMIN role used by the API's
permission checks). Alternatively, run this one-liner right after creating the user:

```bash
python manage.py shell -c "from accounts.models import User; u = User.objects.get(username='YOUR_USERNAME'); u.role = 'ADMIN'; u.save()"
```

### 1.7 Run the backend

```bash
python manage.py runserver
```

The API will be available at **http://127.0.0.1:8000/api/**.

---

## 2. Frontend Setup

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env` if you need to point at a different API URL:

```bash
cp .env.example .env
```

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Run the dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 3. Using the System

1. Visit `http://localhost:5173/register` to create a **Patient** account (self-registration
   is patient-only, matching real-world hospital signup flows).
2. Log in as the **Admin** user you created in step 1.6, then use the Admin dashboard to:
   - Create **Departments** (Cardiology, Neurology, etc.)
   - Create **Doctor** accounts (this creates both the login and the doctor profile)
3. Log in as a **Doctor** to view assigned appointments and complete consultations.
4. Log in as a **Patient** to find doctors, book appointments, and view prescriptions /
   medical history.

### Roles & redirects after login

| Role    | Redirect              |
|---------|------------------------|
| ADMIN   | `/admin/dashboard`     |
| DOCTOR  | `/doctor/dashboard`    |
| PATIENT | `/patient/dashboard`   |

---

## 4. Key API Endpoints

```text
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/token/refresh/
GET    /api/auth/profile/
PUT    /api/auth/profile/
POST   /api/auth/change-password/

GET    /api/departments/            POST /api/departments/
GET    /api/doctors/                POST /api/doctors/
GET    /api/patients/               POST /api/patients/
GET    /api/appointments/           POST /api/appointments/
GET    /api/medical-records/        POST /api/medical-records/

GET    /api/patients/{id}/complete-history/

GET    /api/dashboard/admin/
GET    /api/dashboard/doctor/
GET    /api/dashboard/patient/
```

All endpoints except `register` and `login` require a `Authorization: Bearer <access_token>`
header, which the frontend attaches automatically via an Axios interceptor (and
auto-refreshes the token on a 401).

---

## 5. Notes on Design Decisions

- **Double booking prevention** is enforced both at the database level (a partial unique
  constraint on `doctor + date + time`, excluding cancelled appointments) and at the
  serializer level (a friendly validation error instead of a raw DB error).
- **Consultation → auto-complete**: when a doctor submits a medical record linked to an
  appointment, that appointment's status automatically flips to `COMPLETED`.
- **Role permissions** are enforced in the DRF views/permission classes (`IsAdminUserRole`,
  `IsDoctor`, `IsPatient`) — doctors only ever see their own appointments/patients, and
  patients only ever see their own data.
- Self-registration (`/api/auth/register/`) always creates a `PATIENT` user; Admin and
  Doctor accounts are provisioned by an Admin via the `/api/doctors/` and Django admin /
  `createsuperuser` respectively, which mirrors how real hospitals onboard staff.

---

## 6. Production Notes

Before deploying this to production:
- Set `DEBUG=False` and configure `ALLOWED_HOSTS`.
- Generate a fresh `SECRET_KEY`.
- Serve static/media files via a proper web server or object storage.
- Put the app behind HTTPS and set `CORS_ALLOWED_ORIGINS` to your real frontend domain.
- Consider rotating/blacklisting JWTs on logout everywhere (already wired up via
  `rest_framework_simplejwt.token_blacklist`).
