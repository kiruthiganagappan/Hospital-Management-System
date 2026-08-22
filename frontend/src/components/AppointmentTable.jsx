import StatusBadge from './StatusBadge.jsx'

export default function AppointmentTable({ appointments, columns = 'full', renderActions }) {
  if (!appointments || appointments.length === 0) {
    return <p className="empty-state">No appointments found.</p>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns === 'full' && <th>Patient</th>}
            <th>Doctor</th>
            <th>Department</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              {columns === 'full' && <td>{appt.patient?.user?.full_name}</td>}
              <td>Dr. {appt.doctor?.user?.full_name}</td>
              <td>{appt.department?.name}</td>
              <td>{appt.appointment_date}</td>
              <td>{appt.appointment_time}</td>
              <td>{appt.reason_for_visit}</td>
              <td>
                <StatusBadge status={appt.status} />
              </td>
              {renderActions && <td>{renderActions(appt)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
