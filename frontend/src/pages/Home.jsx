import { Link } from 'react-router-dom'

const DEPARTMENTS = [
  { name: 'Cardiology', icon: '❤️', desc: 'Heart care, ECG, and cardiac consultations.' },
  { name: 'Neurology', icon: '🧠', desc: 'Brain, spine, and nervous system treatment.' },
  { name: 'Orthopedics', icon: '🦴', desc: 'Bone, joint, and sports injury care.' },
  { name: 'Pediatrics', icon: '🧒', desc: 'Complete child health and vaccination care.' },
  { name: 'Dermatology', icon: '🩹', desc: 'Skin, hair, and cosmetic treatments.' },
  { name: 'General Medicine', icon: '🩺', desc: 'Everyday illness and routine checkups.' },
]

const FEATURES = [
  { icon: '📅', title: 'Easy Appointment Booking', desc: 'Patients can find a doctor and book a slot online in a few clicks.' },
  { icon: '👨‍⚕️', title: 'Verified Doctors', desc: 'Every doctor account is created and verified by hospital admin.' },
  { icon: '📋', title: 'Digital Medical Records', desc: 'Prescriptions and consultation history, always available online.' },
  { icon: '🔒', title: 'Secure Role-Based Access', desc: 'Separate, secure logins for Admin, Doctors, and Patients.' },
]

export default function Home() {
  return (
    <div className="home-page">
      {/* Top nav */}
      <header className="home-nav">
        <div className="navbar-brand">
          <span className="navbar-logo">+</span> MedoraX Hospital
        </div>
        <nav className="home-nav-links">
          <Link to="/login?role=doctor" className="btn btn-outline btn-sm">
  Doctor Login
</Link>

<Link to="/login?role=admin" className="btn btn-outline btn-sm">
  Admin Login
</Link>

<Link to="/login?role=patient" className="btn btn-primary btn-sm">
  Patient Login
</Link>
          
        </nav>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-text">
          <h1>Caring for you, every step of the way</h1>
          <p>
           MedoraX Hospital is a full-service hospital offering expert doctors, modern
            departments, and a simple online system to book appointments, track
            prescriptions, and manage your medical history — all in one place.
          </p>
          <div className="home-hero-actions">
            <Link to="/register" className="btn btn-primary">Register as Patient</Link>
            <Link to="/login" className="btn btn-outline">Sign In</Link>
          </div>
        </div>
        <div className="home-hero-card">
          <div className="home-hero-stat">
            <span>24/7</span>
            <p>Emergency Support</p>
          </div>
          <div className="home-hero-stat">
            <span>{DEPARTMENTS.length}+</span>
            <p>Specialist Departments</p>
          </div>
          <div className="home-hero-stat">
            <span>100%</span>
            <p>Verified Doctors</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="home-section">
        <h2 className="section-title">About Our Hospital</h2>
        <p className="home-about-text">
          MedoraX Hospital HMS has been built to bring hospital administration online — from
          patient registration and doctor scheduling to consultations and prescriptions.
          Our admin team manages departments and onboards every doctor, so patients
          always deal with verified, qualified professionals.
        </p>
      </section>

      {/* Departments */}
      <section className="home-section">
        <h2 className="section-title">Our Departments</h2>
        <div className="card-grid">
          {DEPARTMENTS.map((d) => (
            <div className="card home-dept-card" key={d.name}>
              <div className="home-dept-icon">{d.icon}</div>
              <h3>{d.name}</h3>
              <p className="muted">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="card-grid">
          {FEATURES.map((f) => (
            <div className="card home-feature-card" key={f.title}>
              <div className="home-dept-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Login options */}
      <section className="home-section">
        <h2 className="section-title">Login to MedoraX Hospital</h2>
        <div className="card-grid">
          <div className="card home-login-card">
            <div className="home-dept-icon">🛠️</div>
            <h3>Admin</h3>
            <p className="muted">Manage departments, doctors, patients, and appointments.</p>
            <Link to="/login" className="btn btn-primary btn-block">Admin Login</Link>
          </div>
          <div className="card home-login-card">
            <div className="home-dept-icon">👨‍⚕️</div>
            <h3>Doctor</h3>
            <p className="muted">View your appointments, patients, and add prescriptions.</p>
            <Link to="/login" className="btn btn-primary btn-block">Doctor Login</Link>
          </div>
          <div className="card home-login-card">
            <div className="home-dept-icon">🧑</div>
            <h3>Patient</h3>
            <p className="muted">Book appointments and view your medical history.</p>
            <Link to="/login" className="btn btn-primary btn-block">Patient Login</Link>
            <Link to="/register" className="link" style={{ marginTop: 10 }}>New patient? Register here</Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="home-section">
        <h2 className="section-title">Contact & Location</h2>
        <div className="card home-contact-card">
          <div className="detail-grid">
            <div>
              <span className="muted">Address</span>
              <p>123 Health Street,Karaikudi, Tamil Nadu, India</p>
            </div>
            <div>
              <span className="muted">Phone</span>
              <p>+91 98765 43210</p>
            </div>
            <div>
              <span className="muted">Email</span>
              <p>info@MedoraX Hospital.com</p>
            </div>
            <div>
              <span className="muted">Working Hours</span>
              <p>Mon - Sat: 9:00 AM - 8:00 PM · Emergency: 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} MedoraX Hospital. All rights reserved.</p>
      </footer>
    </div>
  )
}
