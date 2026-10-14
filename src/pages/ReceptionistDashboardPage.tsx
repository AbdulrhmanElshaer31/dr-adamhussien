import React, { useState, useEffect, FormEvent, useMemo } from "react"
import { useQueueStore } from "../store/queueStore"
import { Logo } from "../components/common/Logo"
import { StatusBadge } from "../components/common/StatusBadge"
import { QueueEntry, VisitType } from "../types/clinic"
import {
  LayoutDashboard,
  ListOrdered,
  Inbox,
  UserPlus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Play,
  RotateCcw,
  Menu,
  X,
  ArrowRight,
  Eye,
  AlertCircle,
  Tv,
  Stethoscope,
  Search,
  MessageSquare,
  Volume2,
  DollarSign,
  AlertTriangle,
  UserCheck,
  Send,
  Sparkles,
} from "lucide-react"

// Sound chime synthesizer using Web Audio API
const playChimeSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc1 = audioCtx.createOscillator()
    const osc2 = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    osc1.type = "sine"
    osc2.type = "sine"
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime) // D5
    osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15) // A5

    gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6)

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    osc1.start()
    osc2.start(audioCtx.currentTime + 0.15)
    osc1.stop(audioCtx.currentTime + 0.6)
    osc2.stop(audioCtx.currentTime + 0.6)
  } catch {
    // fallback if AudioContext restricted
  }
}

export const ReceptionistDashboardPage: React.FC<{ go: (page: any) => void }> = ({
  go,
}) => {
  const {
    clinic,
    queue,
    bookings,
    nowServing,
    counts,
    callNext,
    startConsultation,
    finishConsultation,
    checkInPatient,
    markLate,
    markNoShow,
    approveBooking,
    rejectBooking,
    addWalkin,
    resetDemoData,
  } = useQueueStore()

  const [activeTab, setActiveTab] = useState<"queue" | "overview" | "requests" | "late">("queue")
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Modals & Drawers
  const [showWalkinModal, setShowWalkinModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<QueueEntry | null>(null)
  const [whatsappSimulation, setWhatsappSimulation] = useState<{
    open: boolean
    patient: QueueEntry | null
    sent: boolean
  }>({ open: false, patient: null, sent: false })
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Walk-in form state with fees
  const [walkName, setWalkName] = useState("")
  const [walkPhone, setWalkPhone] = useState("")
  const [walkService, setWalkService] = useState<VisitType>("كشف عام واستشارة")
  const [walkFee, setWalkFee] = useState<number>(350)

  // Grace period countdown simulation (for called patient)
  const calledPatient = queue.find((p) => p.status === "called")
  const [graceSecondsLeft, setGraceSecondsLeft] = useState(570) // ~9:30 mins

  useEffect(() => {
    if (!calledPatient) return
    const timer = setInterval(() => {
      setGraceSecondsLeft((sec) => (sec > 0 ? sec - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [calledPatient])

  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3200)
  }

  const handleCallNext = () => {
    playChimeSound()
    const res = callNext()
    notify(res.message)
    if (res.success) {
      setGraceSecondsLeft(600) // reset 10 mins
    }
  }

  const handleWalkinSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!walkName.trim()) return
    const res = addWalkin(walkName, walkPhone, walkService)
    setShowWalkinModal(false)
    setWalkName("")
    setWalkPhone("")
    notify(`${res.message} (تم تسجيل الرسوم: ${walkFee} ج.م)`)
  }

  const handleOpenWhatsApp = (p: QueueEntry) => {
    setWhatsappSimulation({ open: true, patient: p, sent: false })
  }

  const handleSendWhatsApp = () => {
    setWhatsappSimulation((prev) => ({ ...prev, sent: true }))
    setTimeout(() => {
      notify(`تم إرسال إشعار WhatsApp للمريض ${whatsappSimulation.patient?.patientName} بنجاح ✓✓`)
      setWhatsappSimulation({ open: false, patient: null, sent: false })
    }, 1200)
  }

  // Filter queue by search and status
  const filteredQueue = useMemo(() => {
    return queue.filter((p) => {
      const matchSearch =
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        String(p.ticketNumber).includes(searchQuery) ||
        p.service.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchSearch) return false

      if (statusFilter === "all") return true
      if (statusFilter === "waiting") return p.status === "checked_in"
      if (statusFilter === "called") return p.status === "called"
      if (statusFilter === "in_chair") return p.status === "in_progress"
      if (statusFilter === "late") return p.status === "late"
      if (statusFilter === "finished") return p.status === "finished"
      return true
    })
  }, [queue, searchQuery, statusFilter])

  const latePatients = queue.filter((p) => p.status === "late")

  return (
    <div
      className={`dashboard receptionist-workstation page-enter ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
      dir="rtl"
    >
      {/* ------------------------------------------------------------------ */}
      {/* SIDEBAR NAVIGATION                                                 */}
      {/* ------------------------------------------------------------------ */}
      <aside className="sidebar">
        <div className="side-logo">
          <Logo light subtitle="شاشة الاستقبال" />
          <button
            className="collapse-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === "queue" ? "active" : ""}
            onClick={() => setActiveTab("queue")}
          >
            <ListOrdered size={18} />
            <span>الطابور المباشر</span>
            <span className="badge-count">{queue.length}</span>
          </button>

          <button
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            <Inbox size={18} />
            <span>طلبات الحجز الأونلاين</span>
            {counts.pendingRequests > 0 && (
              <span className="badge-count warning">{counts.pendingRequests}</span>
            )}
          </button>

          <button
            className={activeTab === "late" ? "active" : ""}
            onClick={() => setActiveTab("late")}
          >
            <AlertCircle size={18} />
            <span>قائمة المتأخرين</span>
            {counts.lateCount > 0 && (
              <span className="badge-count danger">{counts.lateCount}</span>
            )}
          </button>

          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard size={18} />
            <span>إحصائيات وتشغيل اليوم</span>
          </button>

          <div className="sidebar-divider" />

          {/* Direct Switch to other system views */}
          <button onClick={() => go("display")} title="فتح شاشة التلفزيون">
            <Tv size={18} />
            <span>شاشة صالة الانتظار TV</span>
          </button>

          <button onClick={() => go("doctor")} title="لوحة الطبيب في الغرفة">
            <Stethoscope size={18} />
            <span>لوحة غرفة الطبيب</span>
          </button>

          <button onClick={() => go("track")} title="شاشة متابعة المريض">
            <PhoneCall size={18} />
            <span>شاشة تتبع المريض</span>
          </button>
        </nav>

        {/* Clinic live indicator & return */}
        <div className="clinic-status-card">
          <span className="live-dot" />
          <div>
            <b>{clinic.name}</b>
            <small>{clinic.doctorName} · طنطا</small>
          </div>
        </div>

        <button className="back-site-btn" onClick={() => go("home")}>
          <ArrowRight size={16} />
          <span>العودة للموقع</span>
        </button>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT AREA                                                  */}
      {/* ------------------------------------------------------------------ */}
      <main className="dash-main">
        {/* Top Header */}
        <header className="dash-topbar workstation-topbar">
          <div className="topbar-title-block">
            <span className="eyebrow">
              <span className="live-dot" /> محطة إدارة الاستقبال والعيادة
            </span>
            <h1>
              {activeTab === "queue"
                ? "إدارة الطابور والتنسيق اللحظي"
                : activeTab === "requests"
                  ? "صندوق الحجوزات الإلكترونية"
                  : activeTab === "late"
                    ? "سجل الوصول المتأخر وسياسة العدالة"
                    : "إحصائيات وكشوفات اليوم"}
            </h1>
          </div>

          <div className="topbar-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                resetDemoData()
                notify("تمت استعادة البيانات التجريبية الأولية بنجاح.")
              }}
              title="إعادة ضبط السيناريو الأولي للديمو"
            >
              <RotateCcw size={14} />
              إعادة ضبط الديمو
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowWalkinModal(true)}
            >
              <UserPlus size={16} />
              تسجيل مريض حضور مباشر (Walk-in)
            </button>
          </div>
        </header>

        {/* ACTIVE CALLED BANNER (WITH 10-MIN GRACE COUNTDOWN) */}
        {calledPatient && (
          <div className="called-banner-alert">
            <div className="alert-left">
              <span className="alert-pulse-icon">
                <Volume2 size={20} />
              </span>
              <div>
                <b>
                  تم استدعاء المريض #{calledPatient.ticketNumber}: {calledPatient.patientName} ({calledPatient.service})
                </b>
                <p>
                  فترة السماح نشطة: متبقي{" "}
                  <strong>
                    {Math.floor(graceSecondsLeft / 60)}:
                    {String(graceSecondsLeft % 60).padStart(2, "0")} دقيقة
                  </strong>{" "}
                  للدخول لغرفة الكشف.
                </p>
              </div>
            </div>

            <div className="alert-actions">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  const res = startConsultation(calledPatient.ticketNumber)
                  notify(res.message)
                }}
              >
                <Play size={14} /> دخل غرفة الكشف
              </button>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  const res = markLate(calledPatient.ticketNumber)
                  notify(res.message)
                }}
              >
                <AlertCircle size={14} /> تجاوز المهلة (تحويل لمتأخر)
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TAB 1: QUEUE MANAGEMENT TABLE (WORKHORSE)                        */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === "queue" && (
          <div className="dash-content stage-enter">
            {/* Quick Action Bar & Doctor Status */}
            <div className="workstation-action-bar">
              <div className="doctor-status-badge">
                <div className="doctor-avatar-photo">
                  <img
                    src="/doctor-adam-clean.jpg"
                    alt={clinic.doctorName}
                  />
                  <span className="doctor-online-dot" />
                </div>
                <div className="doctor-badge-info">
                  <b className="doctor-badge-name">{clinic.doctorName}</b>
                  <div className="doctor-badge-meta">
                    <span className="room-chip">غرفة العلاج 1</span>
                    <span className="serving-chip">
                      الكشف الجاري:{" "}
                      <strong>{nowServing ? `#${nowServing}` : "الكرسي متاح"}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="workstation-action-buttons">
                <button
                  className="btn btn-primary call-next-hero-btn"
                  onClick={handleCallNext}
                  title="استدعاء المريض التالي المؤهل حسب القواعد"
                >
                  <PhoneCall size={18} />
                  استدعاء المريض التالي
                </button>
              </div>
            </div>

            {/* Search and Status Filters */}
            <div className="table-filter-toolbar">
              <div className="search-input-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="ابحث باسم المريض، رقم التذكرة، أو رقم الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="status-pills-filter">
                <button
                  className={`pill-btn ${statusFilter === "all" ? "active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  الكل ({queue.length})
                </button>
                <button
                  className={`pill-btn ${statusFilter === "waiting" ? "active" : ""}`}
                  onClick={() => setStatusFilter("waiting")}
                >
                  في الانتظار ({queue.filter((q) => q.status === "checked_in").length})
                </button>
                <button
                  className={`pill-btn ${statusFilter === "called" ? "active" : ""}`}
                  onClick={() => setStatusFilter("called")}
                >
                  تم النداء ({queue.filter((q) => q.status === "called").length})
                </button>
                <button
                  className={`pill-btn ${statusFilter === "in_chair" ? "active" : ""}`}
                  onClick={() => setStatusFilter("in_chair")}
                >
                  على الكرسي ({queue.filter((q) => q.status === "in_progress").length})
                </button>
                <button
                  className={`pill-btn ${statusFilter === "late" ? "active" : ""}`}
                  onClick={() => setStatusFilter("late")}
                >
                  متأخرون ({queue.filter((q) => q.status === "late").length})
                </button>
              </div>
            </div>

            {/* Table Card */}
            <div className="table-card workstation-table-card">
              <div className="table-head">
                <div>
                  <h2>قائمة المرضى في الطابور الموحد</h2>
                  <small>محدث لحظياً مع شاشة التلفزيون وهواتف المرضى</small>
                </div>
                <div className="table-quick-stat">
                  <span>
                    المنتظرون: <b>{counts.waiting}</b>
                  </span>
                  <span>
                    اكتمل اليوم: <b>{counts.completedToday}</b>
                  </span>
                </div>
              </div>

              <div className="queue-table">
                <div className="table-row table-labels">
                  <span>رقم الدور</span>
                  <span>اسم المريض</span>
                  <span>الخدمة المطلوبة</span>
                  <span>المصدر</span>
                  <span>حالة الكشف</span>
                  <span>تسجيل الوصول</span>
                  <span>الانتظار</span>
                  <span>إجراءات السكرتيرة</span>
                </div>

                {filteredQueue.length === 0 ? (
                  <div className="empty-table-state">
                    <p>لا توجد نتائج مطابقة لفلتر البحث.</p>
                  </div>
                ) : (
                  filteredQueue.map((p) => {
                    const isNow = p.ticketNumber === nowServing
                    const isLate = p.status === "late"
                    const isCalled = p.status === "called"

                    return (
                      <div
                        key={p.ticketNumber}
                        className={`table-row ${isNow ? "active-row" : ""} ${
                          isLate ? "late-row" : ""
                        } ${isCalled ? "called-row" : ""}`}
                      >
                        <b className="q-num">#{p.ticketNumber}</b>

                        <span className="patient-name">
                          {p.patientName}
                          <small>{p.phone}</small>
                        </span>

                        <span className="service-cell">{p.service}</span>

                        <span>
                          <span
                            className={`source-chip ${
                              p.source === "walk_in" ? "walk" : "online"
                            }`}
                          >
                            {p.source === "walk_in" ? "حضور مباشر" : "حجز أونلاين"}
                          </span>
                        </span>

                        <StatusBadge status={p.status} />

                        <span className="text-xs">
                          {p.checkInTime ? `حضر: ${p.checkInTime}` : "لم يصل بعد"}
                        </span>

                        <span className="text-xs">
                          {p.status === "in_progress"
                            ? "داخل الغرفة"
                            : p.status === "finished"
                              ? "اكتمل الكشف"
                              : p.estimatedWaitMinutes
                                ? `${p.estimatedWaitMinutes} دقيقة`
                                : "—"}
                        </span>

                        <div className="row-actions">
                          {/* 1. Check in (Arrival) */}
                          {p.status === "not_arrived" && (
                            <button
                              className="btn-action checkin-btn"
                              onClick={() => {
                                const res = checkInPatient(p.ticketNumber)
                                notify(res.message)
                              }}
                              title="تسجيل وصول المريض إلى العيادة"
                            >
                              <UserCheck size={13} />
                              <span>تسجيل وصول</span>
                            </button>
                          )}

                          {/* 2. Call Next */}
                          {p.status === "checked_in" && (
                            <button
                              className="btn-action call-btn"
                              onClick={() => {
                                playChimeSound()
                                const res = callNext()
                                notify(res.message)
                              }}
                              title="نداء المريض"
                            >
                              <Volume2 size={13} />
                              <span>استدعاء</span>
                            </button>
                          )}

                          {/* 3. Start consultation or Late */}
                          {p.status === "called" && (
                            <>
                              <button
                                className="btn-action start-btn"
                                onClick={() => {
                                  const res = startConsultation(p.ticketNumber)
                                  notify(res.message)
                                }}
                                title="بدء الكشف في الغرفة"
                              >
                                <Play size={13} />
                                <span>بدء الكشف</span>
                              </button>
                              <button
                                className="btn-action late-btn"
                                onClick={() => {
                                  const res = markLate(p.ticketNumber)
                                  notify(res.message)
                                }}
                                title="تسجيل وصول متأخر"
                              >
                                <AlertTriangle size={13} />
                                <span>متأخر</span>
                              </button>
                            </>
                          )}

                          {/* 4. Finish consultation */}
                          {p.status === "in_progress" && (
                            <button
                              className="btn-action finish-btn"
                              onClick={() => {
                                const res = finishConsultation(p.ticketNumber)
                                notify(res.message)
                              }}
                              title="إنهاء الكشف وتسجيل الزيارة"
                            >
                              <CheckCircle2 size={13} />
                              <span>إنهاء الكشف</span>
                            </button>
                          )}

                          {/* 5. Late returned */}
                          {p.status === "late" && (
                            <button
                              className="btn-action requeue-btn"
                              onClick={() => {
                                const res = checkInPatient(p.ticketNumber)
                                notify(res.message)
                              }}
                              title="تسجيل عودة المريض المتأخر للانتظار"
                            >
                              <RotateCcw size={13} />
                              <span>عاد للانتظار</span>
                            </button>
                          )}

                          {/* WhatsApp simulation */}
                          <button
                            className="btn-action icon-btn whatsapp-btn"
                            onClick={() => handleOpenWhatsApp(p)}
                            title="إرسال إشعار WhatsApp للمريض"
                          >
                            <MessageSquare size={14} />
                          </button>

                          {/* Details */}
                          <button
                            className="btn-action icon-btn"
                            onClick={() => setSelectedPatient(p)}
                            title="عرض تفاصيل الزيارة"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TAB 2: ONLINE REQUESTS INBOX                                     */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === "requests" && (
          <div className="dash-content stage-enter">
            <div className="requests-head">
              <span className="eyebrow">صندوق الحجوزات الواردة</span>
              <h2>طلبات الحجز الأونلاين من الموقع</h2>
              <p>
                تظهر هنا طلبات المرضى المرسلة عبر الموقع بانتظار تأكيد الاستقبال.
                بمجرد الضغط على "تأكيد وقبول"، يُخصص للمريض رقم دور رسمي ويُدرج في
                طابور اليوم.
              </p>
            </div>

            <div className="request-list">
              {bookings.length === 0 ? (
                <p>لا توجد طلبات حجز مسجلة.</p>
              ) : (
                bookings.map((b) => (
                  <article key={b.reference} className="request-card">
                    <div className="request-ref">
                      <b>{b.reference}</b>
                      <small>{b.createdAt}</small>
                    </div>

                    <div className="request-patient">
                      <h3>{b.patientName}</h3>
                      <span>{b.phone}</span>
                      {b.note && <small className="patient-note">ملاحظة: {b.note}</small>}
                    </div>

                    <div className="request-service">
                      <small>نوع الزيارة</small>
                      <b>{b.service}</b>
                    </div>

                    <div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="request-actions">
                      {b.status === "pending" ? (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              const res = approveBooking(b.reference)
                              notify(res.message)
                            }}
                          >
                            <CheckCircle2 size={14} /> قبول وتخصيص دور
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              const res = rejectBooking(b.reference)
                              notify(res.message)
                            }}
                          >
                            <XCircle size={14} /> رفض
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-muted">
                          {b.status === "confirmed"
                            ? `مؤكد بالدور #${b.ticketNumber}`
                            : b.status === "completed"
                              ? "اكتملت الزيارة"
                              : "تم إغلاق الطلب"}
                        </span>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TAB 3: LATE ARRIVALS BOARD                                       */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === "late" && (
          <div className="dash-content stage-enter">
            <div className="requests-head">
              <span className="eyebrow">إدارة التأخير والعدالة</span>
              <h2>سجل المرضى المتأخرين وسياسة الإعادة</h2>
              <p>
                المرضى الذين تجاوزوا فترة السماح (10 دقائق) بعد النداء. لا يُلغى حجزهم،
                وعند حضورهم للاستقبال يُعاد تفعيلهم ليُخدم كل منهم بعد مريضين جاهزين.
              </p>
            </div>

            <div className="late-board-grid">
              {latePatients.length === 0 ? (
                <div className="empty-state-box">
                  <ShieldCheck size={36} />
                  <h3>لا يوجد مرضى متأخرون حالياً</h3>
                  <p>جميع المرضى ملتزمون بمواعيد النداء وسير الطابور منتظم.</p>
                </div>
              ) : (
                latePatients.map((p) => (
                  <div key={p.ticketNumber} className="late-patient-card">
                    <div className="late-card-top">
                      <b>#{p.ticketNumber}</b>
                      <StatusBadge status="late" />
                    </div>
                    <h4>{p.patientName}</h4>
                    <p>{p.service}</p>
                    <small>الهاتف: {p.phone}</small>

                    <div className="late-reinsert-action">
                      <button
                        className="btn btn-primary btn-sm btn-full"
                        onClick={() => {
                          const res = checkInPatient(p.ticketNumber)
                          notify(res.message)
                        }}
                      >
                        <UserCheck size={14} /> تسجيل حضوره وإعادته للطابور
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TAB 4: OVERVIEW & FINANCIALS                                     */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === "overview" && (
          <div className="dash-content stage-enter">
            <div className="metric-grid">
              <div className="metric-card">
                <span>
                  <Clock size={20} />
                </span>
                <small>المرضى في الانتظار</small>
                <b>{counts.waiting}</b>
                <em>جاهزون للاستدعاء</em>
              </div>

              <div className="metric-card">
                <span>
                  <Play size={20} />
                </span>
                <small>داخل غرفة الكشف</small>
                <b>{counts.inChair}</b>
                <em>غرفة الكشف 1</em>
              </div>

              <div className="metric-card">
                <span>
                  <CheckCircle2 size={20} />
                </span>
                <small>حالات اكتملت اليوم</small>
                <b>{counts.completedToday}</b>
                <em>متوسط 22 دقيقة لكل كشف</em>
              </div>

              <div className="metric-card">
                <span>
                  <Inbox size={20} />
                </span>
                <small>طلبات أونلاين معلقة</small>
                <b>{counts.pendingRequests}</b>
                <em>بانتظار الموافقة</em>
              </div>

              <div className="metric-card">
                <span>
                  <AlertCircle size={20} />
                </span>
                <small>وصول متأخر</small>
                <b>{counts.lateCount}</b>
                <em>حسب سياسة العيادة</em>
              </div>
            </div>

            {/* Financial Collections Snapshot */}
            <div className="financial-snapshot-card mt-4">
              <div className="card-title">
                <div>
                  <span className="eyebrow">الخزينة والتحصيل اليومي</span>
                  <h2>ملخص رسوم الكشف والخدمات</h2>
                </div>
                <span className="finance-total-badge">
                  <DollarSign size={16} /> إجمالي المقبوضات: <b>4,250 ج.م</b>
                </span>
              </div>

              <div className="financial-breakdown">
                <div>
                  <small>كشوفات عامة واستشارات (8)</small>
                  <b>2,800 ج.م</b>
                </div>
                <div>
                  <small>تنظيف وتلميع أسنان (3)</small>
                  <b>1,800 ج.م</b>
                </div>
                <div>
                  <small>جلسات علاج جذور (1)</small>
                  <b>1,200 ج.م</b>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* WALK-IN REGISTRATION MODAL                                         */}
      {/* ------------------------------------------------------------------ */}
      {showWalkinModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowWalkinModal(false)}>
          <form
            className="modal walkin-modal"
            onSubmit={handleWalkinSubmit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">تسجيل فوري عند شباك الاستقبال</span>
                <h2>تسجيل مريض حضور مباشر (Walk-in)</h2>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowWalkinModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <label>
              اسم المريض بالكامل
              <input
                type="text"
                value={walkName}
                onChange={(e) => setWalkName(e.target.value)}
                placeholder="مثال: حسام الدين محمود"
                required
                autoFocus
              />
            </label>

            <label>
              رقم الهاتف <small>(لإرسال إشعار الواتساب عند اقتراب الدور)</small>
              <input
                type="tel"
                value={walkPhone}
                onChange={(e) => setWalkPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
              />
            </label>

            <label>
              نوع الخدمة المطلوبة
              <select
                value={walkService}
                onChange={(e) => {
                  const s = e.target.value as VisitType
                  setWalkService(s)
                  if (s === "كشف عام واستشارة") setWalkFee(350)
                  else if (s === "تنظيف وتلميع الأسنان") setWalkFee(600)
                  else if (s === "علاج الجذور وحشو العصب") setWalkFee(1200)
                  else setWalkFee(500)
                }}
              >
                <option value="كشف عام واستشارة">كشف عام واستشارة (350 ج.م)</option>
                <option value="تنظيف وتلميع الأسنان">تنظيف وتلميع الأسنان (600 ج.م)</option>
                <option value="علاج الجذور وحشو العصب">علاج الجذور وحشو العصب (1200 ج.م)</option>
                <option value="تجميل وعدسات الأسنان">استشارة تجميل وعدسات (500 ج.م)</option>
                <option value="ألم أسنان / تقييم عاجل">تقييم طارئ وألم عاجل (400 ج.م)</option>
              </select>
            </label>

            <div className="fee-preview-box">
              <span>رسوم الزيارة المقررة:</span>
              <strong>{walkFee} ج.م</strong>
            </div>

            <div className="modal-note">
              <ShieldCheck size={16} />
              <span>
                سيتم إصدار تذكرة فورية، وإدراج المريض مباشرة في طابور {clinic.doctorName} كحالة
                "حاضر في الانتظار".
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              تأكيد التسجيل وإصدار رقم الدور
            </button>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* WHATSAPP SIMULATION MODAL                                          */}
      {/* ------------------------------------------------------------------ */}
      {whatsappSimulation.open && whatsappSimulation.patient && (
        <div
          className="modal-backdrop"
          onMouseDown={() =>
            setWhatsappSimulation({ open: false, patient: null, sent: false })
          }
        >
          <div
            className="modal whatsapp-sim-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">إشعار آلي للمريض</span>
                <h2>إرسال تنبيه WhatsApp للدور</h2>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() =>
                  setWhatsappSimulation({ open: false, patient: null, sent: false })
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="whatsapp-preview-box">
              <div className="wa-bubble">
                <p>
                  مرحباً <b>{whatsappSimulation.patient.patientName}</b> 👋<br />
                  نود إعلامك أن دورك في <b>عيادة LUMA — {clinic.doctorName}</b> اقترب!
                  <br />
                  <br />
                  📌 رقم تذكرتك: <b>#{whatsappSimulation.patient.ticketNumber}</b>
                  <br />
                  🩺 الخدمة: {whatsappSimulation.patient.service}
                  <br />
                  ⏱️ المتبقي قبلك: مريض واحد فقط.
                  <br />
                  <br />
                  يرجى التواجد في صالة الاستقبال بالعيادة (شارع النحاس، طنطا).
                </p>
                <span className="wa-time">الآن ✓✓</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full mt-3"
              onClick={handleSendWhatsApp}
              disabled={whatsappSimulation.sent}
            >
              {whatsappSimulation.sent ? (
                <>
                  <CheckCircle2 size={16} /> تم الإرسال للمريض...
                </>
              ) : (
                <>
                  <Send size={16} /> إرسال الرسالة إلى {whatsappSimulation.patient.phone}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PATIENT DETAILS MODAL                                              */}
      {/* ------------------------------------------------------------------ */}
      {selectedPatient && (
        <div className="modal-backdrop" onMouseDown={() => setSelectedPatient(null)}>
          <div
            className="modal details-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">بطاقة المريض</span>
                <h2>تذكرة الدور #{selectedPatient.ticketNumber}</h2>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setSelectedPatient(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="detail-grid">
              <div>
                <small>اسم المريض</small>
                <b>{selectedPatient.patientName}</b>
              </div>
              <div>
                <small>الهاتف</small>
                <b>{selectedPatient.phone}</b>
              </div>
              <div>
                <small>الخدمة المطلوبة</small>
                <b>{selectedPatient.service}</b>
              </div>
              <div>
                <small>مصدر الحجز</small>
                <b>{selectedPatient.source === "walk_in" ? "حضور مباشر" : "أونلاين"}</b>
              </div>
              <div>
                <small>مرجع الحجز</small>
                <b>{selectedPatient.bookingReference}</b>
              </div>
              <div>
                <small>حالة الدور الحالية</small>
                <StatusBadge status={selectedPatient.status} />
              </div>
              <div>
                <small>وقت الحضور المسجل</small>
                <b>{selectedPatient.checkInTime || "لم يسجل بعد"}</b>
              </div>
              <div>
                <small>وقت الاستدعاء</small>
                <b>{selectedPatient.calledAt || "لم يستدعَ بعد"}</b>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-full"
              onClick={() => setSelectedPatient(null)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Modern Clean White Toaster Alert */}
      {toastMessage && (
        <div className="toast clean-toast" role="alert">
          <div className="toast-icon">
            <CheckCircle2 size={18} />
          </div>
          <div className="toast-body">
            <b className="toast-title">إشعار النظام اللحظي</b>
            <p className="toast-text">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}
