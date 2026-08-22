import { Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../components/ProtectedRoute.jsx'
import RoleBasedRoute from '../components/RoleBasedRoute.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Public pages
import Home from '../pages/Home.jsx'

// Auth pages
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import ForgotPassword from '../pages/auth/ForgotPassword.jsx'
import Profile from '../pages/auth/Profile.jsx'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import Doctors from '../pages/admin/Doctors.jsx'
import AddDoctor from '../pages/admin/AddDoctor.jsx'
import EditDoctor from '../pages/admin/EditDoctor.jsx'
import AdminDoctorDetails from '../pages/admin/DoctorDetails.jsx'
import Patients from '../pages/admin/Patients.jsx'
import AddPatient from '../pages/admin/AddPatient.jsx'
import EditPatient from '../pages/admin/EditPatient.jsx'
import AdminPatientDetails from '../pages/admin/PatientDetails.jsx'
import PatientCompleteHistory from '../pages/admin/PatientCompleteHistory.jsx'
import Departments from '../pages/admin/Departments.jsx'
import AdminAppointments from '../pages/admin/Appointments.jsx'

// Doctor pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard.jsx'
import DoctorProfile from '../pages/doctor/DoctorProfile.jsx'
import DoctorAppointments from '../pages/doctor/DoctorAppointments.jsx'
import MyPatients from '../pages/doctor/MyPatients.jsx'
import DoctorPatientHistory from '../pages/doctor/PatientHistory.jsx'
import Consultation from '../pages/doctor/Consultation.jsx'
import DoctorPrescriptions from '../pages/doctor/Prescriptions.jsx'

// Patient pages
import PatientDashboard from '../pages/patient/PatientDashboard.jsx'
import PatientProfile from '../pages/patient/PatientProfile.jsx'
import FindDoctors from '../pages/patient/FindDoctors.jsx'
import PatientDoctorDetails from '../pages/patient/DoctorDetails.jsx'
import BookAppointment from '../pages/patient/BookAppointment.jsx'
import MyAppointments from '../pages/patient/MyAppointments.jsx'
import AppointmentHistory from '../pages/patient/AppointmentHistory.jsx'
import MyPrescriptions from '../pages/patient/MyPrescriptions.jsx'
import MyMedicalHistory from '../pages/patient/MyMedicalHistory.jsx'

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Home />
  const redirects = {
    ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
    PATIENT: '/patient/dashboard',
  }
  return <Navigate to={redirects[user.role] || '/login'} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <Doctors />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/add"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AddDoctor />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminDoctorDetails />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/:id/edit"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <EditDoctor />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <Patients />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients/add"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AddPatient />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminPatientDetails />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients/:id/edit"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <EditPatient />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients/:id/history"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <PatientCompleteHistory />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <Departments />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminAppointments />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Doctor routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DOCTOR']}>
              <DoctorProfile />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DOCTOR']}>
              <DoctorAppointments />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DOCTOR']}>
              <MyPatients />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients/:id/history"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DOCTOR']}>
              <DoctorPatientHistory />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/consultation/:appointmentId"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DOCTOR']}>
              <Consultation />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['DOCTOR']}>
              <DoctorPrescriptions />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Patient routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <PatientProfile />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <FindDoctors />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <PatientDoctorDetails />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <BookAppointment />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <MyAppointments />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointment-history"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <AppointmentHistory />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <MyPrescriptions />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/medical-history"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['PATIENT']}>
              <MyMedicalHistory />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
