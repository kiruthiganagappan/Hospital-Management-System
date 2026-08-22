const STATUS_CLASSES = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  COMPLETED: 'badge-completed',
  CANCELLED: 'badge-cancelled',
}

export default function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_CLASSES[status] || ''}`}>{status}</span>
}
