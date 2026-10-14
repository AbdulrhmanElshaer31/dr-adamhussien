import React from "react"
import { useQueueStore } from "../store/queueStore"
import { Logo } from "../components/common/Logo"
import { StatusBadge } from "../components/common/StatusBadge"
import {
  Stethoscope,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  ShieldAlert,
  Play,
  RotateCcw,
} from "lucide-react"

export const DoctorRoomPage: React.FC<{ go: (page: any) => void }> = ({ go }) => {
  const {
    clinic,
    queue,
    currentPatientInChair,
    nextUpPatient,
    counts,
    callNext,
    startConsultation,
    finishConsultation,
    resetDemoData,
  } = useQueueStore()

  const calledPatient = queue.find((p) => p.status === "called")
  const completedToday = queue.filter((p) => p.status === "finished")

  return (
    <div className="doctor-room-page page-enter" dir="rtl">
      {/* Top Bar */}
      <header className="doctor-topbar">
        <div className="container nav-wrap">
          <div className="doctor-brand">
            <Logo light subtitle="عيادة الدكتور" />
            <span className="room-badge">
              <i className="live-dot" /> غرفة الكشف 1 · {clinic.doctorName}
            </span>
          </div>

          <div className="doctor-nav-actions">
            <button className="btn btn-secondary" onClick={() => go("dashboard")}>
              لوحة الاستقبال
            </button>
            <button className="btn btn-secondary" onClick={() => go("display")}>
              شاشة العرض (TV)
            </button>
            <button className="btn btn-ghost text-white" onClick={() => go("home")}>
              <ArrowRight size={16} />
              العودة للموقع
            </button>
          </div>
        </div>
      </header>

      <main className="container doctor-room-main">
        {/* Main Stage: Current Chair Status */}
        <div className="doctor-grid-layout">
          <div className="doctor-primary-panel">
            {currentPatientInChair ? (
              <div className="active-patient-card">
                <div className="card-status-header">
                  <span className="status-pill active">
                    <span className="live-dot" /> المريض الحالي على الكرسي
                  </span>
                  <span className="time-badge">
                    <Clock size={15} /> بدأ الكشف: {currentPatientInChair.consultationStart || "الآن"}
                  </span>
                </div>

                <div className="active-patient-body">
                  <div className="ticket-hero-num">
                    <small>رقم التذكرة</small>
                    <strong>#{currentPatientInChair.ticketNumber}</strong>
                  </div>

                  <div className="patient-specs">
                    <h2>{currentPatientInChair.patientName}</h2>
                    <p className="service-tag">{currentPatientInChair.service}</p>
                    <div className="meta-details">
                      <span>
                        <User size={14} /> مرجع الحجز: <b>{currentPatientInChair.bookingReference}</b>
                      </span>
                      <span>
                        المصدر: <b>{currentPatientInChair.source === "online" ? "حجز أونلاين" : "حضور مباشر"}</b>
                      </span>
                      <span>
                        الهاتف: <b>{currentPatientInChair.phone}</b>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="doctor-actions-row">
                  <button
                    className="btn btn-primary finish-btn"
                    onClick={() => finishConsultation(currentPatientInChair.ticketNumber)}
                  >
                    <CheckCircle2 size={18} />
                    إنهاء الكشف وتسجيل الزيارة
                  </button>
                </div>
              </div>
            ) : calledPatient ? (
              <div className="called-waiting-card">
                <div className="card-status-header">
                  <span className="status-pill warning">
                    <span className="live-dot" /> تم النداء — بانتظار دخوله الغرفة
                  </span>
                  <span className="time-badge">
                    فترة السماح حتى: {calledPatient.gracePeriodEndsAt || "10 دقائق"}
                  </span>
                </div>

                <div className="called-info">
                  <div className="ticket-hero-num">
                    <small>رقم الدور</small>
                    <strong>#{calledPatient.ticketNumber}</strong>
                  </div>
                  <div>
                    <h2>{calledPatient.patientName}</h2>
                    <p>{calledPatient.service}</p>
                    <small className="text-muted">
                      تم النداء عليه في الساعة {calledPatient.calledAt}. يرجى تأكيد دخوله لكرسي العلاج.
                    </small>
                  </div>
                </div>

                <div className="doctor-actions-row">
                  <button
                    className="btn btn-primary"
                    onClick={() => startConsultation(calledPatient.ticketNumber)}
                  >
                    <Play size={18} />
                    بدء الكشف ودخول المريض
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-chair-card">
                <div className="empty-chair-icon">
                  <Stethoscope size={48} />
                </div>
                <h2>كرسي العلاج متاح الآن</h2>
                <p>
                  لا يوجد مريض داخل غرفة الكشف حالياً. يمكنك استدعاء المريض التالي المؤهل من صالة الانتظار.
                </p>
                {nextUpPatient ? (
                  <div className="next-preview-box">
                    <small>المريض التالي المؤهل للاستدعاء:</small>
                    <b>
                      #{nextUpPatient.ticketNumber} — {nextUpPatient.patientName} ({nextUpPatient.service})
                    </b>
                  </div>
                ) : (
                  <p className="no-patient-alert">
                    <ShieldAlert size={16} /> لا يوجد مرضى حاضرون في صالة الانتظار حالياً.
                  </p>
                )}

                <button
                  className="btn btn-primary"
                  onClick={() => callNext()}
                  disabled={!nextUpPatient}
                >
                  استدعاء المريض التالي
                </button>
              </div>
            )}
          </div>

          {/* Sidebar: Day summary & Quick Actions */}
          <aside className="doctor-sidebar-summary">
            <div className="stat-card">
              <h3>ملخص اليوم التشغيلي</h3>
              <div className="doctor-metrics">
                <div>
                  <small>حالات اكتملت</small>
                  <b>{counts.completedToday}</b>
                </div>
                <div>
                  <small>في الانتظار</small>
                  <b>{counts.waiting}</b>
                </div>
                <div>
                  <small>متأخرون</small>
                  <b>{counts.lateCount}</b>
                </div>
              </div>
            </div>

            <div className="completed-list-card">
              <h3>الكشوفات المنتهية اليوم</h3>
              {completedToday.length === 0 ? (
                <p className="text-muted text-sm">لم تنتهِ أي كشوفات حتى الآن اليوم.</p>
              ) : (
                <ul className="completed-cases-list">
                  {completedToday.map((p) => (
                    <li key={p.ticketNumber}>
                      <div>
                        <b>#{p.ticketNumber}</b>
                        <span>{p.patientName}</span>
                      </div>
                      <small>{p.service}</small>
                      <StatusBadge status="finished" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="demo-reset-box">
              <small>أداة العرض التوضيحي:</small>
              <button className="btn btn-secondary btn-sm" onClick={resetDemoData}>
                <RotateCcw size={14} /> إعادة ضبط بيانات الديمو
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
