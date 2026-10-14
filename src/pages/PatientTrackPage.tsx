import React, { useState } from "react"
import { useQueueStore } from "../store/queueStore"
import { Header } from "../components/common/Header"
import { StatusBadge } from "../components/common/StatusBadge"
import {
  Clock,
  RefreshCw,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Check,
  ArrowRight,
  Info,
} from "lucide-react"

export const PatientTrackPage: React.FC<{ go: (page: any) => void }> = ({ go }) => {
  const { queue, nowServing, callNext, startConsultation, finishConsultation } =
    useQueueStore()

  // Track sample patient (default #127 or first active patient)
  const [selectedTicket, setSelectedTicket] = useState<number>(127)

  const patient = queue.find((p) => p.ticketNumber === selectedTicket) || queue[0]

  // Calculate position ahead of patient
  const patientsAhead = queue.filter(
    (p) =>
      ["checked_in", "called"].includes(p.status) &&
      p.ticketNumber < (patient?.ticketNumber ?? 999),
  ).length

  const isCurrentServing = nowServing === patient?.ticketNumber
  const isCalled = patient?.status === "called"
  const isFinished = patient?.status === "finished"

  const statusHeadline = isCurrentServing
    ? "حان دورك الآن! يرجى التوجه لغرفة الكشف."
    : isCalled
      ? "تم استدعاؤك! فترة السماح 10 دقائق."
      : isFinished
        ? "اكتمل كشفك الطبي. نتمنى لك دوام الصحة والعافية."
        : patientsAhead <= 1
          ? "دورك اقترب جداً! يرجى الاستعداد في العيادة."
          : `أنت في الانتظار — متبقي قبلك ${patientsAhead} مرضى.`

  return (
    <div className="track-page page-enter" dir="rtl">
      <Header currentPage="track" go={go} />

      <main className="container track-shell">
        {/* Heading & Reference Bar */}
        <div className="track-heading">
          <div>
            <span className="eyebrow">
              <span className="live-dot" /> متابعة الطابور لحظة بلحظة
            </span>
            <h1>
              أهلاً بك،
              <br />
              <em>دورك وموعدك بوضوح تام.</em>
            </h1>
          </div>

          <div className="track-ref-card">
            <small>مرجع الحجز الثابت</small>
            <b>{patient?.bookingReference || "LUMA-8K24"}</b>
            <span>الاسم: {patient?.patientName || "مريم خالد"}</span>
          </div>
        </div>

        {/* Main Grid: Card + Notification */}
        <div className="track-grid">
          {/* Main Card */}
          <section className="main-queue-card">
            <div className="queue-card-top">
              <StatusBadge status={patient?.status || "checked_in"} />
              <span className="live-update-tag">
                <i className="live-dot" /> متصل بالعيادة مباشرة
              </span>
            </div>

            <div className="your-big-number">
              <small>رقم تذكرتك اليوم</small>
              <strong>#{patient?.ticketNumber || 127}</strong>
              <div className="pulse-ring" />
            </div>

            <div className="queue-stats">
              <div>
                <small>الكشف الحالي</small>
                <b>{nowServing ? `#${nowServing}` : "—"}</b>
              </div>
              <div>
                <small>المرضى قبلك</small>
                <b>{patientsAhead} مرضى</b>
              </div>
              <div>
                <small>الانتظار المتوقع</small>
                <b>
                  {isCurrentServing
                    ? "حان دورك"
                    : patientsAhead === 0
                      ? "أقل من 5 دقائق"
                      : `${patientsAhead * 12}–${patientsAhead * 18} دقيقة`}
                </b>
              </div>
            </div>

            <div className="track-interactive-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => callNext()}
                title="اضغط لتجربة محاكاة نداء التالي من النظام"
              >
                <RefreshCw size={14} /> محاكاة تقدم الطابور
              </button>
            </div>
          </section>

          {/* Side Alert Card */}
          <aside className="notification-card">
            <span className="notification-icon">
              {isCalled ? (
                <PhoneCall size={24} />
              ) : isCurrentServing ? (
                <Check size={24} />
              ) : (
                <Sparkles size={24} />
              )}
            </span>
            <div>
              <small>تنبيه مباشر للزيارة</small>
              <h3>{statusHeadline}</h3>
              <p>
                يتم تحديث هذه الصفحة فور قيام سكرتارية العيادة أو الطبيب بأي إجراء، دون
                الحاجة لإعادة تحميل الصفحة.
              </p>
            </div>
          </aside>
        </div>

        {/* Timeline representation */}
        <section className="timeline-card">
          <div className="card-title">
            <div>
              <span className="eyebrow">حركة الطابور التفاعلية</span>
              <h2>أين موقعك بين مرضى اليوم؟</h2>
            </div>
            <small>تحديث فوري من نفس جلسة النظام</small>
          </div>

          <div className="queue-timeline">
            {queue.slice(0, 6).map((item) => {
              const isYou = item.ticketNumber === patient?.ticketNumber
              const isServing = item.ticketNumber === nowServing
              const isDone = item.status === "finished"

              return (
                <div
                  key={item.ticketNumber}
                  className={`timeline-item ${isServing ? "current" : ""} ${
                    isYou ? "you" : ""
                  } ${isDone ? "done" : ""}`}
                >
                  <span>
                    {isDone ? <Check size={16} /> : `#${item.ticketNumber}`}
                  </span>
                  <b>
                    {isServing
                      ? "داخل الكشف"
                      : isYou
                        ? "أنت (دورك)"
                        : isDone
                          ? "اكتمل"
                          : item.status === "called"
                            ? "تم النداء"
                            : item.status === "late"
                              ? "متأخر"
                              : "في الانتظار"}
                  </b>
                  <small>{item.service}</small>
                </div>
              )
            })}
          </div>
        </section>

        {/* Late Policy Card */}
        <section className="late-policy">
          <div>
            <span className="eyebrow">قواعد العدالة في العيادة</span>
            <h2>سياسة التأخير وحفظ الدور</h2>
            <p className="text-sm text-muted">
              نظام مصمم لضمان عدم إهدار وقت المرضى الحاضرين في مواعيدهم مع الحفاظ على حق
              المريض المتأخر في استكمال علاجه.
            </p>
          </div>
          <ol>
            <li>
              <b>إشعار مسبق:</b> نرسل إشعاراً عندما يقترب دورك (متبقي قبلك مريض أو اثنان).
            </li>
            <li>
              <b>فترة سماح 10 دقائق:</b> عند النداء الرسمي، تبدأ مهلة 10 دقائق كافية للدخول
              لغرفة العلاج.
            </li>
            <li>
              <b>إعادة الجدولة دون إلغاء:</b> إذا انقضت المهلة، ينتقل الحجز لقائمة
              الوصول المتأخر ويُخدم بعد مريضين جاهزين دون تخطي مريض حضر في موعده.
            </li>
            <li>
              <b>الحالات الطارئة:</b> تخضع الحالات الطبية العاجلة لتقييم الطبيب الفوري
              بشكل منفصل عن الطابور الروتيني.
            </li>
          </ol>
        </section>
      </main>
    </div>
  )
}
