import { NavLink } from 'react-router-dom'

const LINKS = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/doctors', label: 'Doctors' },
    { to: '/admin/patients', label: 'Patients' },
    { to: '/admin/departments', label: 'Departments' },
    { to: '/admin/appointments', label: 'Appointments' },
    { to: '/profile', label: 'My Profile' },
  ],
  DOCTOR: [
    { to: '/doctor/dashboard', label: 'Dashboard' },
    { to: '/doctor/appointments', label: 'My Appointments' },
    { to: '/doctor/patients', label: 'My Patients' },
    { to: '/doctor/prescriptions', label: 'Prescriptions' },
    { to: '/doctor/profile', label: 'My Profile' },
  ],
  PATIENT: [
    { to: '/patient/dashboard', label: 'Dashboard' },
    { to: '/patient/doctors', label: 'Find Doctors' },
    { to: '/patient/appointments', label: 'My Appointments' },
    { to: '/patient/prescriptions', label: 'Prescriptions' },
    { to: '/patient/medical-history', label: 'Medical History' },
    { to: '/patient/profile', label: 'My Profile' },
  ],
}

export default function Sidebar({ role }) {
  const links = LINKS[role] || []
  return (
    <aside className="sidebar">
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
