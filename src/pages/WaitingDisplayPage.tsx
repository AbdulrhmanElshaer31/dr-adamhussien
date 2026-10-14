import React, { useEffect, useState } from "react"
import { useQueueStore } from "../store/queueStore"
import { Logo, SmileMark } from "../components/common/Logo"
import { Volume2, VolumeX, X, ArrowLeft, Clock } from "lucide-react"

export const WaitingDisplayPage: React.FC<{ go: (page: any) => void }> = ({ go }) => {
  const { clinic, nowServing, currentPatientInChair, nextUpPatient, upcomingPatients, callNext } =
    useQueueStore()
  const [time, setTime] = useState(new Date())
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="display-page page-enter" dir="rtl">
      {/* TV Header */}
      <header className="display-header">
        <Logo light subtitle="شاشة صالة الانتظار" />
        <div className="display-actions">
          <button
            className="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="تفعيل/تعطيل الصوت"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{soundEnabled ? "الصوت مفعّل" : "الصوت صامت"}</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={() => callNext()}>
            محاكاة: نداء التالي
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => go("dashboard")}
            title="فتح لوحة الاستقبال"
          >
            لوحة الاستقبال
          </button>

          <button
            className="display-close-btn"
            onClick={() => go("home")}
            aria-label="العودة للموقع"
            title="العودة للموقع الرئيسي"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Display Layout */}
      <main className="display-main-grid">
        {/* Big Active Serving Box */}
        <section className="serving-block">
          <span className="display-label">
            <i className="live-dot" /> يتم الكشف الآن
          </span>

          <strong key={nowServing ?? "none"} className="number-change">
            {nowServing ? `#${nowServing}` : "—"}
          </strong>

          <p className="room-indicator">غرفة الكشف 1 · {clinic.doctorName}</p>
          <SmileMark light className="display-bg-smile" />
        </section>

        {/* Next and Ready List */}
        <section className="display-side">
          {/* Next Up */}
          <div className="next-display">
            <div>
              <small>الدور التالي</small>
              <span>يرجى التوجه للاستعداد</span>
            </div>
            <b>{nextUpPatient ? `#${nextUpPatient.ticketNumber}` : "—"}</b>
          </div>

          {/* Upcoming Tickets (No PII) */}
          <div className="ready-list">
            <h2>الأدوار القادمة بالترتيب</h2>
            {upcomingPatients.length === 0 ? (
              <p className="empty-upcoming-text">لا توجد أدوار أخرى مسجلة حالياً</p>
            ) : (
              upcomingPatients.slice(0, 4).map((patient, index) => (
                <div key={patient.ticketNumber} className="upcoming-row">
                  <b>#{patient.ticketNumber}</b>
                  <span>{index === 0 ? "قريباً" : "في الانتظار"}</span>
                </div>
              ))
            )}
          </div>

          {/* Polite Announcement */}
          <div className="announcement">
            <p>
              راحتكم وخصوصيتكم أولويتنا. يمكنكم متابعة دوركم مباشرة من هواتفكم عبر كود
              الحجز دون الحاجة للبقاء في صالة الانتظار.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="display-footer">
        <span>LUMA Dental Studio · شارع النحاس، طنطا</span>
        <time className="live-time">
          <Clock size={16} />
          {time.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </time>
        <span>شاشة عرض عامة — بيانات المرضى محمية</span>
      </footer>
    </div>
  )
}
