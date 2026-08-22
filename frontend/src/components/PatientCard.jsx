export default function PatientCard({ patient, onClick, actions }) {
  return (
    <div className="patient-card" onClick={onClick}>
      <div className="patient-card-avatar">
        {patient.user.first_name?.[0]}
        {patient.user.last_name?.[0]}
      </div>
      <div className="patient-card-body">
        <h4>{patient.user.full_name}</h4>
        <p className="muted">{patient.user.email}</p>
        <p className="muted">Blood group: {patient.blood_group}</p>
      </div>
      {actions && <div className="patient-card-actions">{actions}</div>}
    </div>
  )
}
