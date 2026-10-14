import React from "react"
import { BookingStatus, QueueStatus } from "../../types/clinic"

interface StatusBadgeProps {
  status: QueueStatus | BookingStatus | string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case "in_progress":
      case "داخل الكشف":
        return { label: "داخل الكشف", tone: "active", dot: true }
      case "called":
      case "تم النداء":
        return { label: "تم النداء", tone: "warning", dot: true }
      case "checked_in":
      case "حاضر في الانتظار":
        return { label: "حاضر في الانتظار", tone: "success", dot: false }
      case "not_arrived":
      case "لم يصل بعد":
        return { label: "لم يصل بعد", tone: "neutral", dot: false }
      case "late":
      case "متأخر":
        return { label: "وصول متأخر", tone: "danger", dot: false }
      case "no_show":
      case "لم يحضر":
        return { label: "لم يحضر", tone: "danger", dot: false }
      case "finished":
      case "completed":
      case "مكتمل":
        return { label: "مكتمل", tone: "success", dot: false }
      case "confirmed":
      case "مؤكد":
        return { label: "مؤكد", tone: "success", dot: false }
      case "pending":
      case "قيد المراجعة":
        return { label: "قيد المراجعة", tone: "warning", dot: true }
      case "rejected":
      case "مرفوض":
      case "cancelled":
      case "ملغي":
        return { label: "ملغي", tone: "danger", dot: false }
      default:
        return { label: status, tone: "neutral", dot: false }
    }
  }

  const { label, tone, dot } = getBadgeConfig()

  return (
    <span className={`status status-${tone}`}>
      {dot && <i className="status-dot" />}
      {label}
    </span>
  )
}
