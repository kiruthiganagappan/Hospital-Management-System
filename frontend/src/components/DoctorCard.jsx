export default function DoctorCard({ doctor, onClick, actions }) {
  return (
    <div className="doctor-card" onClick={onClick}>
      <div className="doctor-card-avatar">
        {doctor.user.first_name?.[0]}
        {doctor.user.last_name?.[0]}
      </div>
      <div className="doctor-card-body">
        <h4>Dr. {doctor.user.full_name}</h4>
        <p className="muted">{doctor.specialization || 'General'}</p>
        <p className="muted">{doctor.department?.name}</p>
        <p className="doctor-card-fee">₹{doctor.consultation_fee}</p>
      </div>
      {actions && <div className="doctor-card-actions">{actions}</div>}
    </div>
  )
}
