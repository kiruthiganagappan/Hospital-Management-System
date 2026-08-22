export default function DashboardCard({ title, value, icon, tone = 'default' }) {
  return (
    <div className={`dashboard-card tone-${tone}`}>
      <div className="dashboard-card-icon">{icon}</div>
      <div>
        <p className="dashboard-card-value">{value}</p>
        <p className="dashboard-card-title">{title}</p>
      </div>
    </div>
  )
}
