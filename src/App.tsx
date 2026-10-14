import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react"

type Page = "home" | "booking" | "track" | "display" | "dashboard"
type QueueStatus = "قيد المراجعة" | "مؤكد" | "بانتظار الدخول" | "تم النداء" | "داخل الكشف" | "مكتمل" | "متأخر" | "لم يحضر" | "ملغي"

type Patient = {
  id: number
  name: string
  service: string
  source: "أونلاين" | "حضور"
  status: QueueStatus
  checkedIn: boolean
  wait: string
  phone?: string
}

const heroImage =
  "https://images.unsplash.com/photo-1662837625421-5fd8ed6131a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400"
const clinicImage =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=85&w=1400"

const initialQueue: Patient[] = [
  {
    id: 124,
    name: "محمود",
    service: "تنظيف الأسنان",
    source: "أونلاين",
    status: "داخل الكشف",
    checkedIn: true,
    wait: "—",
    phone: "010 *** 2841",
  },
  {
    id: 125,
    name: "سارة",
    service: "كشف عام",
    source: "أونلاين",
    status: "متأخر",
    checkedIn: false,
    wait: "22 د",
    phone: "011 *** 9043",
  },
  {
    id: 126,
    name: "عمر",
    service: "حشو وعلاج",
    source: "أونلاين",
    status: "بانتظار الدخول",
    checkedIn: true,
    wait: "18 د",
    phone: "012 *** 2208",
  },
  {
    id: 127,
    name: "نور",
    service: "استشارة تجميل",
    source: "أونلاين",
    status: "بانتظار الدخول",
    checkedIn: true,
    wait: "12 د",
    phone: "010 *** 4387",
  },
  {
    id: 128,
    name: "يوسف",
    service: "كشف عام",
    source: "حضور",
    status: "مؤكد",
    checkedIn: true,
    wait: "7 د",
    phone: "—",
  },
]

const services = [
  {
    icon: "sparkle",
    title: "الكشف العام",
    text: "فحص شامل وخطة علاج واضحة تناسب احتياجك.",
  },
  {
    icon: "clean",
    title: "تنظيف الأسنان",
    text: "جلسة احترافية لطيفة تعيد لابتسامتك نضارتها.",
  },
  {
    icon: "smile",
    title: "تجميل الأسنان",
    text: "حلول مدروسة لابتسامة طبيعية وواثقة.",
  },
  {
    icon: "sun",
    title: "تبييض الأسنان",
    text: "تفتيح آمن بدرجة مناسبة لطبيعة أسنانك.",
  },
  {
    icon: "root",
    title: "علاج الجذور",
    text: "علاج دقيق يخفف الألم ويحافظ على السن.",
  },
  {
    icon: "shield",
    title: "الفحص الدوري",
    text: "متابعة استباقية للمحافظة على صحة فمك.",
  },
]

const visitTypes = [
  "كشف عام",
  "تنظيف الأسنان",
  "استشارة تجميل",
  "ألم أسنان / تقييم عاجل",
  "أخرى",
]

function Icon({ name, size = 20 }: { name: string size?: number }) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    phone: (
      <path d="M8.2 3.8 10 8 7.8 9.5a14.5 14.5 0 0 0 6.7 6.7L16 14l4.2 1.8v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.2 6a2 2 0 0 1 2-2.2h3Z" />
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    refresh: (
      <>
        <path d="M20 11a8 8 0 1 0-2.3 5.7" />
        <path d="M20 4v7h-7" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    volume: (
      <>
        <path d="M11 5 6 9H2v6h4l5 4V5ZM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h12M9 12h12M9 18h12" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h9l5 5v15H6Z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
      </>
    ),
    walk: (
      <>
        <circle cx="13" cy="4" r="2" />
        <path d="m10 22 2-7-3-3 2-5 5 3 3 1M12 15l4 2 2 5M9 12l-4 4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    sparkle: (
      <path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3ZM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />
    ),
    clean: (
      <>
        <path d="M6 3c3 1 9 1 12 0l-2 18H8L6 3Z" />
        <path d="M8 9h8" />
      </>
    ),
    smile: (
      <>
        <path d="M4 9c1.5 7 14.5 7 16 0" />
        <path d="M8 5h.01M16 5h.01" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    root: (
      <path d="M7 3c-2 4-2 7 0 10l2 8 3-6 3 6 2-8c2-3 2-6 0-10-3 2-7 2-10 0Z" />
    ),
    shield: <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />,
  }
  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.sparkle}
    </svg>
  )
}

function SmileMark({ light = false }: { light?: boolean }) {
  return (
    <svg className="smile-mark" viewBox="0 0 120 62" aria-hidden="true">
      <path
        d="M8 13c9 48 92 54 104 0"
        fill="none"
        stroke={light ? "#F7F5EF" : "#174E49"}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M92 8l2.7 7.3L102 18l-7.3 2.7L92 28l-2.7-7.3L82 18l7.3-2.7L92 8Z"
        fill="#E9C8A9"
      />
    </svg>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-symbol">
        <SmileMark light={light} />
      </span>
      <span>
        <b>LUMA</b>
        <small>Dental Studio</small>
      </span>
    </div>
  )
}

function Button({
  children,
  onClick,
  kind = "primary",
  type = "button",
  className = "",
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  kind?: "primary" | "secondary" | "ghost" | "danger"
  type?: "button" | "submit"
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      className={`btn btn-${kind} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function StatusBadge({ status }: { status: QueueStatus | string }) {
  const tone = ["مكتمل", "مؤكد"].includes(status)
    ? "success"
    : ["متأخر", "لم يحضر", "ملغي"].includes(status)
      ? "danger"
      : ["تم النداء", "داخل الكشف"].includes(status)
        ? "active"
        : "neutral"
  return (
    <span className={`status status-${tone}`}>
      <i />
      {status}
    </span>
  )
}

function Header({ go }: { go: (page: Page) => void }) {
  const [open, setOpen] = useState(false)
  const nav = (page: Page) => {
    go(page)
    setOpen(false)
  }
  return (
    <header className="site-header">
      <nav className="container nav-wrap" aria-label="التنقل الرئيسي">
        <button
          className="logo-button"
          onClick={() => nav("home")}
          aria-label="العودة للرئيسية"
        >
          <Logo />
        </button>
        <div className={`nav-links ${open ? "nav-open" : ""}`}>
          <button onClick={() => nav("home")}>الرئيسية</button>
          <a href="#services" onClick={() => setOpen(false)}>
            الخدمات
          </a>
          <a href="#doctor" onClick={() => setOpen(false)}>
            طبيبنا
          </a>
          <a href="#how" onClick={() => setOpen(false)}>
            الحجز
          </a>
          <a href="#contact" onClick={() => setOpen(false)}>
            تواصل معنا
          </a>
          <button className="track-link" onClick={() => nav("track")}>
            تابع دورك
          </button>
          <Button onClick={() => nav("booking")}>احجز موعدك</Button>
        </div>
        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </nav>
    </header>
  )
}

function Home({
  go,
  nowServing,
}: {
  go: (p: Page) => void
  nowServing: number
}) {
  return (
    <div className="page-enter">
      <Header go={go} />
      <main>
        <section className="hero">
          <div className="hero-grain" />
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <span className="eyebrow">
                <span className="live-dot" /> تجربة أسنان أهدى في قلب طنطا
              </span>
              <h1>
                ابتسامتك تستحق <em>تجربة أفضل.</em>
              </h1>
              <p>
                احجز زيارتك في ثوانٍ، تابع دورك لحظة بلحظة، واستمتع بتجربة أكثر
                راحة من أول خطوة.
              </p>
              <div className="hero-actions">
                <Button onClick={() => go("booking")}>
                  احجز زيارتك <Icon name="arrow" />
                </Button>
                <Button kind="secondary" onClick={() => go("track")}>
                  تابع دورك
                </Button>
              </div>
              <div className="hero-meta">
                <span>
                  <Icon name="pin" /> شارع النحاس، طنطا
                </span>
                <a href="tel:01023143535">
                  <Icon name="phone" /> 01023143535
                </a>
              </div>
            </div>
            <div className="hero-visual reveal-delay">
              <div className="hero-image">
                <img
                  src={heroImage}
                  alt="طبيب أسنان يطمئن مريضة داخل عيادة حديثة"
                />
              </div>
              <div className="float-card appointment-card">
                <span className="mini-icon">
                  <Icon name="calendar" />
                </span>
                <div>
                  <small>موعد اليوم</small>
                  <b>د. آدم حسن</b>
                  <span>6:30 مساءً</span>
                </div>
                <span className="check-circle">
                  <Icon name="check" size={14} />
                </span>
              </div>
              <div className="float-card queue-card">
                <div className="queue-title">
                  <span>
                    <i className="live-dot" /> الطابور مباشر
                  </span>
                  <small>بيانات تجريبية</small>
                </div>
                <div className="queue-numbers">
                  <div>
                    <small>الدور الحالي</small>
                    <b>#{nowServing}</b>
                  </div>
                  <div>
                    <small>دورك</small>
                    <b>#127</b>
                  </div>
                </div>
                <div className="wait-row">
                  <Icon name="clock" />
                  <span>الانتظار المتوقع</span>
                  <b>15–25 دقيقة</b>
                </div>
              </div>
              <div className="hero-smile">
                <SmileMark light />
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-grid">
            {[
              ["sparkle", "رعاية إنسانية", "اهتمام وهدوء في كل زيارة"],
              ["file", "خطوات واضحة", "تعرف دائمًا ما الذي سيحدث"],
              ["refresh", "متابعة مباشرة", "شاهد دورك بدون انتظار طويل"],
              ["users", "بدون حساب", "احجز باسمك ورقم هاتفك فقط"],
            ].map(([icon, title, text]) => (
              <div className="trust-item" key={title}>
                <span>
                  <Icon name={icon} />
                </span>
                <div>
                  <b>{title}</b>
                  <small>{text}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">خدماتنا</span>
                <h2>
                  كل ما تحتاجه ابتسامتك،
                  <br />
                  <em>في مكان واحد.</em>
                </h2>
              </div>
              <p>
                رعاية متكاملة تبدأ بالتشخيص الدقيق وتنتهي بخطة علاج مفهومة
                ومريحة.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service, i) => (
                <article
                  className={`service-card service-${i + 1}`}
                  key={service.title}
                >
                  <span className="service-num">0{i + 1}</span>
                  <span className="service-icon">
                    <Icon name={service.icon} size={26} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <button
                    onClick={() => go("booking")}
                    aria-label={`احجز خدمة ${service.title}`}
                  >
                    <Icon name="arrow" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section doctor-section" id="doctor">
          <div className="container doctor-grid">
            <div className="doctor-photo">
              <img
                src={clinicImage}
                alt="غرفة علاج حديثة وهادئة في عيادة أسنان"
              />
              <span className="photo-caption">عيادة هادئة مجهزة بعناية</span>
            </div>
            <div className="doctor-copy">
              <span className="eyebrow">قابل طبيبك</span>
              <h2>د. آدم حسن</h2>
              <h3>طب الأسنان العام والتجميلي</h3>
              <p>
                نؤمن أن زيارة طبيب الأسنان يمكن أن تكون بسيطة ومطمئنة. نستمع
                أولًا، نشرح كل خطوة، ونبني خطة تناسبك بدون تعقيد.
              </p>
              <div className="doctor-hours">
                <Icon name="clock" />
                <div>
                  <b>مواعيد العمل</b>
                  <span>السبت – الخميس · 2 ظهرًا – 10 مساءً</span>
                </div>
              </div>
              <small className="demo-note">
                بيانات الطبيب والعيادة نموذج توضيحي قابل للاستبدال.
              </small>
              <Button onClick={() => go("booking")}>
                احجز مع الطبيب <Icon name="arrow" />
              </Button>
            </div>
          </div>
        </section>

        <section className="section how-section" id="how">
          <div className="container">
            <div className="center-head">
              <span className="eyebrow">كيف تعمل التجربة؟</span>
              <h2>
                من الحجز إلى كرسي الطبيب،
                <br />
                <em>كل خطوة أبسط.</em>
              </h2>
            </div>
            <div className="steps-line">
              {[
                [
                  "calendar",
                  "اختر زيارتك",
                  "حدد نوع الزيارة وأدخل بيانات التواصل الأساسية.",
                ],
                [
                  "file",
                  "استلم تذكرتك",
                  "نرسل طلبك للاستقبال وتحصل على مرجع ثابت.",
                ],
                [
                  "refresh",
                  "تابع دورك",
                  "شاهد الدور الحالي ووقت الانتظار التقريبي مباشرة.",
                ],
              ].map((step, i) => (
                <div className="step" key={step[1]}>
                  <span className="step-num">0{i + 1}</span>
                  <div className="step-icon">
                    <Icon name={step[0]} size={28} />
                  </div>
                  <h3>{step[1]}</h3>
                  <p>{step[2]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section queue-preview">
          <div className="container preview-card">
            <div className="preview-copy">
              <span className="eyebrow light">الانتظار بشكل أذكى</span>
              <h2>
                دورك واضح،
                <br />
                ووقتك ليك.
              </h2>
              <p>تابع تقدم الطابور قبل وصولك وخليك قريب لما يحين دورك.</p>
              <Button kind="secondary" onClick={() => go("track")}>
                افتح شاشة المتابعة <Icon name="arrow" />
              </Button>
              <small>الأوقات تقديرية وتعتمد على مدة كل كشف.</small>
            </div>
            <div className="preview-panel">
              <div className="panel-top">
                <span>
                  <i className="live-dot" /> تحديث تجريبي مباشر
                </span>
                <small>آخر تحديث: الآن</small>
              </div>
              <div className="now-number">
                <small>يتم الكشف الآن</small>
                <strong>#{nowServing}</strong>
                <span>غرفة الكشف 1</span>
              </div>
              <div className="upcoming">
                <div>
                  <small>التالي</small>
                  <b>#126</b>
                </div>
                <div className="your-number">
                  <small>دورك</small>
                  <b>#127</b>
                </div>
                <div>
                  <small>بعدك</small>
                  <b>#128</b>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer go={go} />
    </div>
  )
}

function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer id="contact">
      <div className="container footer-top">
        <div className="footer-cta">
          <Logo light />
          <h2>
            جاهز لزيارة أسنان
            <br />
            أكثر راحة؟
          </h2>
          <Button kind="secondary" onClick={() => go("booking")}>
            احجز زيارتك الآن
          </Button>
        </div>
        <div className="footer-info">
          <div>
            <b>زورنا</b>
            <span>شارع النحاس، طنطا</span>
            <span>الغربية، مصر</span>
          </div>
          <div>
            <b>تواصل معنا</b>
            <a href="tel:01023143535">01023143535</a>
            <span>hello@lumadental.demo</span>
          </div>
          <div>
            <b>مواعيد العمل</b>
            <span>السبت – الخميس</span>
            <span>2 ظهرًا – 10 مساءً</span>
          </div>
          <div>
            <b>استكشف</b>
            <button onClick={() => go("track")}>تابع دورك</button>
            <button onClick={() => go("display")}>شاشة الانتظار</button>
            <button onClick={() => go("dashboard")}>لوحة الاستقبال</button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 LUMA Dental Studio — نموذج تجريبي</span>
        <span>صُمم لراحة كل ابتسامة.</span>
      </div>
    </footer>
  )
}

function Booking({
  go,
  addBooking,
}: {
  go: (p: Page) => void
  addBooking: (p: Patient) => void
}) {
  const [step, setStep] = useState(1)
  const [visit, setVisit] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")

  const nextDetails = (e: FormEvent) => {
    e.preventDefault()
    if (
      name.trim().length < 3 ||
      !/^01[0125]\d{8}$/.test(phone.replace(/\s/g, ""))
    ) {
      setError("من فضلك اكتب اسمك كاملًا ورقم موبايل مصري صحيح.")
      return
    }
    setError("")
    setStep(3)
  }
  const submit = () => {
    addBooking({
      id: 129,
      name: name.split(" ")[0],
      service: visit,
      source: "أونلاين",
      status: "قيد المراجعة",
      checkedIn: false,
      wait: "جديد",
      phone,
    })
    setStep(4)
  }

  return (
    <div className="booking-page page-enter">
      <Header go={go} />
      <main className="booking-shell">
        <div className="booking-aside">
          <Logo light />
          <div>
            <span className="eyebrow light">حجز بدون حساب</span>
            <h2>
              زيارتك تبدأ
              <br />
              براحة.
            </h2>
            <p>أربع خطوات بسيطة وتذكرتك تكون جاهزة للمتابعة.</p>
          </div>
          <SmileMark light />
          <small>بياناتك تستخدم للتواصل بخصوص هذا الطلب فقط.</small>
        </div>
        <div className="booking-main">
          <div className="booking-top">
            <button
              onClick={() =>
                step > 1 && step < 4 ? setStep(step - 1) : go("home")
              }
            >
              <Icon name="arrow" /> رجوع
            </button>
            <span>الخطوة {Math.min(step, 4)} من 4</span>
          </div>
          <div className="progress">
            <i style={{ width: `${step * 25}%` }} />
          </div>
          {step === 1 && (
            <div className="form-stage stage-enter">
              <span className="eyebrow">اختيار نوع الزيارة</span>
              <h1>إيه سبب زيارتك؟</h1>
              <p>اختار أقرب وصف، والطبيب هيأكد التفاصيل معاك.</p>
              <div className="visit-options">
                {visitTypes.map((v, i) => (
                  <button
                    key={v}
                    className={visit === v ? "selected" : ""}
                    onClick={() => setVisit(v)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <b>{v}</b>
                    <i>{visit === v && <Icon name="check" size={16} />}</i>
                  </button>
                ))}
              </div>
              {visit.includes("عاجل") && (
                <div className="urgent-note">
                  <b>تنبيه مهم</b>
                  <p>
                    الحجز أونلاين لا يغني عن تقييم الطوارئ. للأعراض الشديدة أو
                    المتزايدة بسرعة تواصل مباشرة مع العيادة أو جهة الطوارئ
                    المناسبة.
                  </p>
                </div>
              )}
              <Button onClick={() => visit && setStep(2)} disabled={!visit}>
                التالي: بياناتك <Icon name="arrow" />
              </Button>
            </div>
          )}
          {step === 2 && (
            <form className="form-stage stage-enter" onSubmit={nextDetails}>
              <span className="eyebrow">بيانات المريض</span>
              <h1>نتواصل معاك إزاي؟</h1>
              <p>مش محتاج حساب أو كلمة سر.</p>
              <label>
                الاسم بالكامل
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد محمد علي"
                  autoComplete="name"
                />
              </label>
              <label>
                رقم الموبايل
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>
              <label>
                ملاحظة للعيادة <small>اختياري — بدون تفاصيل طبية حساسة</small>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="مثال: أفضل ميعاد بعد الساعة 6 مساءً"
                  rows={3}
                />
              </label>
              {error && <div className="form-error">{error}</div>}
              <Button type="submit">
                راجع طلبك <Icon name="arrow" />
              </Button>
            </form>
          )}
          {step === 3 && (
            <div className="form-stage stage-enter review-stage">
              <span className="eyebrow">قبل إرسال الطلب</span>
              <h1>الطابور اليوم</h1>
              <p>العيادة تستقبل طلبات جديدة حاليًا.</p>
              <div className="queue-snapshot">
                <div>
                  <span className="live-dot" />
                  <small>الدور الحالي</small>
                  <b>#124</b>
                </div>
                <div>
                  <Icon name="users" />
                  <small>القادمون</small>
                  <b>#125 · #126 · #127</b>
                </div>
                <div>
                  <Icon name="clock" />
                  <small>الانتظار المتوقع</small>
                  <b>15–25 دقيقة</b>
                </div>
              </div>
              <div className="request-summary">
                <h3>ملخص الطلب</h3>
                <div>
                  <span>الاسم</span>
                  <b>{name}</b>
                </div>
                <div>
                  <span>نوع الزيارة</span>
                  <b>{visit}</b>
                </div>
                <div>
                  <span>الحالة بعد الإرسال</span>
                  <StatusBadge status="قيد المراجعة" />
                </div>
              </div>
              <div className="policy-short">
                <Icon name="clock" />
                <p>
                  <b>رقم الطابور لا يضمن وقت كشف محددًا.</b> عند النداء يبدأ وقت
                  سماح 10 دقائق، وبعده ينتقل المريض لنظام الوصول المتأخر حسب
                  سياسة العيادة.
                </p>
              </div>
              <Button onClick={submit}>
                إرسال طلب الحجز <Icon name="check" />
              </Button>
            </div>
          )}
          {step === 4 && (
            <div className="ticket-stage stage-enter">
              <div className="success-spark">
                <Icon name="sparkle" size={30} />
              </div>
              <span className="eyebrow">تم إرسال طلبك بنجاح</span>
              <h1>تذكرتك جاهزة يا {name.split(" ")[0]}</h1>
              <p>الطلب قيد مراجعة الاستقبال، وليس حجزًا مؤكدًا بعد.</p>
              <div className="digital-ticket">
                <div className="ticket-head">
                  <Logo />
                  <StatusBadge status="قيد المراجعة" />
                </div>
                <div className="ticket-number">
                  <small>رقم الدور المقترح</small>
                  <strong>#129</strong>
                  <SmileMark />
                </div>
                <div className="ticket-data">
                  <div>
                    <small>مرجع الحجز الثابت</small>
                    <b>LUMA-8K24</b>
                  </div>
                  <div>
                    <small>نوع الزيارة</small>
                    <b>{visit}</b>
                  </div>
                  <div>
                    <small>مواعيد العمل</small>
                    <b>2 ظ – 10 م</b>
                  </div>
                  <div className="qr" aria-label="رمز QR توضيحي">
                    <i />
                    <i />
                    <i />
                    <i />
                    <span>DEMO</span>
                  </div>
                </div>
                <small className="ticket-hint">
                  مرجع الحجز ثابت، أما ترتيب الدور المباشر فقد يتغير مع تشغيل
                  العيادة.
                </small>
              </div>
              <div className="ticket-actions">
                <Button onClick={() => go("track")}>
                  تابع دورك <Icon name="arrow" />
                </Button>
                <Button kind="secondary" onClick={() => window.print()}>
                  اطبع التذكرة
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Track({
  go,
  nowServing,
  advance,
}: {
  go: (p: Page) => void
  nowServing: number
  advance: () => void
}) {
  const ahead = Math.max(0, 127 - nowServing)
  const status =
    nowServing >= 127
      ? "من فضلك توجّه للاستقبال"
      : ahead <= 1
        ? "دورك قرب"
        : "بانتظار الدخول"
  const [updated, setUpdated] = useState("الآن")
  const refresh = () => {
    advance()
    setUpdated("منذ لحظات")
  }
  return (
    <div className="track-page page-enter">
      <Header go={go} />
      <main className="container track-shell">
        <div className="track-heading">
          <div>
            <span className="eyebrow">متابعة تجريبية مباشرة</span>
            <h1>
              أهلًا يا نور،
              <br />
              <em>دورك واضح.</em>
            </h1>
          </div>
          <div className="reference">
            <small>مرجع الحجز</small>
            <b>LUMA-8K24</b>
          </div>
        </div>
        <div className="track-grid">
          <section className="main-queue-card">
            <div className="queue-card-top">
              <StatusBadge status={status} />
              <span>
                <i className="live-dot" /> محاكاة مباشرة
              </span>
            </div>
            <div className="your-big-number">
              <small>رقم دورك</small>
              <strong>#127</strong>
              <div className="pulse-ring" />
            </div>
            <div className="queue-stats">
              <div>
                <small>الدور الحالي</small>
                <b>#{nowServing}</b>
              </div>
              <div>
                <small>المتبقي قبلك</small>
                <b>{ahead} مرضى</b>
              </div>
              <div>
                <small>الانتظار المتوقع</small>
                <b>
                  {ahead === 0
                    ? "حان دورك"
                    : ahead <= 1
                      ? "5–10 دقائق"
                      : "15–25 دقيقة"}
                </b>
              </div>
            </div>
            <button className="refresh-line" onClick={refresh}>
              <Icon name="refresh" /> آخر تحديث: {updated} · اضغط لمحاكاة تقدم
              الدور
            </button>
          </section>
          <aside className="notification-card">
            <span className="notification-icon">
              <Icon name={ahead <= 1 ? "phone" : "sparkle"} />
            </span>
            <div>
              <small>تنبيه داخل النموذج فقط</small>
              <h3>
                {ahead === 0
                  ? "دورك الآن، من فضلك توجّه للاستقبال."
                  : ahead <= 1
                    ? "دورك قرب، خليك قريب من العيادة."
                    : "إنت بتقرب! لسه كام مريض قبلك."}
              </h3>
              <p>لا يتم إرسال رسائل SMS أو واتساب حقيقية في هذا النموذج.</p>
            </div>
          </aside>
        </div>
        <section className="timeline-card">
          <div className="card-title">
            <div>
              <span className="eyebrow">حركة الطابور</span>
              <h2>فين مكانك دلوقتي؟</h2>
            </div>
            <small>الترتيب يتحدث في نفس جلسة النموذج</small>
          </div>
          <div className="queue-timeline">
            {[124, 125, 126, 127, 128].map((n) => (
              <div
                className={`timeline-item ${
                  n === nowServing ? "current" : ""
                } ${n === 127 ? "you" : ""} ${n < nowServing ? "done" : ""}`}
                key={n}
              >
                <span>
                  {n < nowServing ? <Icon name="check" size={16} /> : `#${n}`}
                </span>
                <b>
                  {n === nowServing
                    ? "داخل الكشف"
                    : n === 127
                      ? "دورك"
                      : n < nowServing
                        ? "اكتمل"
                        : "في الانتظار"}
                </b>
                <small>
                  {n === 125
                    ? "وصول متأخر"
                    : n === 128
                      ? "حضور للعيادة"
                      : "أونلاين"}
                </small>
              </div>
            ))}
          </div>
        </section>
        <section className="late-policy">
          <div>
            <span className="eyebrow">سياسة التأخير ببساطة</span>
            <h2>لو اتأخرت عن دورك</h2>
          </div>
          <ol>
            <li>
              <b>هننبهك لما دورك يقرب.</b> التنبيهات هنا داخل النموذج فقط.
            </li>
            <li>
              <b>لما يتم النداء، عندك 10 دقائق سماح.</b>
            </li>
            <li>
              <b>بعد الوقت ده، بتدخل قائمة الوصول المتأخر</b> من غير ما تتخطى
              المرضى الحاضرين الجاهزين.
            </li>
            <li>
              <b>مرجع حجزك يفضل صالح،</b> لكن ترتيب خدمتك المباشر ممكن يتغير.
              الحالات الطبية العاجلة تخضع للتقييم الطبي بشكل منفصل.
            </li>
          </ol>
        </section>
      </main>
    </div>
  )
}

function WaitingDisplay({
  go,
  nowServing,
  advance,
}: {
  go: (p: Page) => void
  nowServing: number
  advance: () => void
}) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])
  return (
    <div className="display-page page-enter">
      <header>
        <Logo light />
        <div className="display-actions">
          <span>
            <Icon name="volume" /> الصوت غير مفعّل
          </span>
          <Button kind="secondary" onClick={advance}>
            تشغيل العرض: التالي
          </Button>
          <button onClick={() => go("home")}>
            <Icon name="close" />
          </button>
        </div>
      </header>
      <main>
        <section className="serving-block">
          <span className="display-label">
            <i className="live-dot" /> يتم الكشف الآن
          </span>
          <strong key={nowServing} className="number-change">
            #{nowServing}
          </strong>
          <p>غرفة الكشف 1</p>
          <SmileMark light />
        </section>
        <section className="display-side">
          <div className="next-display">
            <small>التالي</small>
            <b>#{nowServing + 1}</b>
            <span>من فضلك كن مستعدًا</span>
          </div>
          <div className="ready-list">
            <h2>يرجى الاستعداد</h2>
            {[nowServing + 2, nowServing + 3, nowServing + 4].map((n, i) => (
              <div key={n}>
                <b>#{n}</b>
                <span>{i === 0 ? "قريبًا" : "في الانتظار"}</span>
              </div>
            ))}
          </div>
          <div className="announcement">
            <Icon name="sparkle" />
            <p>
              راحتكم تهمنا. يمكنكم متابعة دوركم من الهاتف باستخدام مرجع الحجز.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <span>شارع النحاس، طنطا · 01023143535</span>
        <time>
          {time.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
        <span>عرض توضيحي — بدون بيانات شخصية</span>
      </footer>
    </div>
  )
}

function Dashboard({
  go,
  queue,
  setQueue,
  nowServing,
  setNowServing,
}: {
  go: (p: Page) => void
  queue: Patient[]
  setQueue: React.Dispatch<React.SetStateAction<Patient[]>>
  nowServing: number
  setNowServing: React.Dispatch<React.SetStateAction<number>>
}) {
  const [tab, setTab] = useState("الطابور المباشر")
  const [collapsed, setCollapsed] = useState(false)
  const [modal, setModal] = useState<"walkin" | "details" | null>(null)
  const [selected, setSelected] = useState<Patient | null>(null)
  const [toast, setToast] = useState("")
  const [walkName, setWalkName] = useState("")
  const [walkService, setWalkService] = useState("كشف عام")
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2800)
  }
  const update = (id: number, status: QueueStatus, checkedIn?: boolean) => {
    setQueue((q) =>
      q.map((p) =>
        p.id === id ? { ...p, status, checkedIn: checkedIn ?? p.checkedIn } : p,
      ),
    )
    notify(`تم تحديث حالة رقم #${id} إلى «${status}»`)
  }
  const callNext = () => {
    if (queue.some((p) => p.status === "داخل الكشف")) {
      notify("لا يمكن نداء مريض جديد قبل إنهاء الكشف الحالي.")
      return
    }
    const next = queue.find(
      (p) => p.checkedIn && ["بانتظار الدخول", "مؤكد"].includes(p.status),
    )
    if (!next) {
      notify("لا يوجد مريض جاهز للنداء الآن.")
      return
    }
    update(next.id, "تم النداء")
    setNowServing(next.id)
  }
  const addWalkin = (e: FormEvent) => {
    e.preventDefault()
    if (!walkName.trim()) return
    const id = Math.max(...queue.map((p) => p.id)) + 1
    setQueue((q) => [
      ...q,
      {
        id,
        name: walkName.split(" ")[0],
        service: walkService,
        source: "حضور",
        status: "مؤكد",
        checkedIn: true,
        wait: "الآن",
      },
    ])
    setModal(null)
    setWalkName("")
    notify(`تمت إضافة ${walkName} إلى نفس طابور الطبيب برقم #${id}`)
  }

  const counts = useMemo(
    () => ({
      waiting: queue.filter((p) =>
        ["بانتظار الدخول", "مؤكد", "تم النداء"].includes(p.status),
      ).length,
      pending: queue.filter((p) => p.status === "قيد المراجعة").length,
      late: queue.filter((p) => p.status === "متأخر").length,
      active: queue.filter((p) => p.status === "داخل الكشف").length,
    }),
    [queue],
  )
  const navItems = [
    ["home", "نظرة عامة"],
    ["list", "الطابور المباشر"],
    ["file", "طلبات الحجز"],
    ["walk", "الحضور المباشر"],
    ["users", "المرضى"],
    ["clock", "نشاط اليوم"],
    ["settings", "الإعدادات"],
  ]

  return (
    <div
      className={`dashboard ${collapsed ? "sidebar-collapsed" : ""}`}
      dir="rtl"
    >
      <aside className="sidebar">
        <div className="side-logo">
          <Logo light />
          <button onClick={() => setCollapsed(!collapsed)}>
            <Icon name="menu" />
          </button>
        </div>
        <nav>
          {navItems.map(([icon, label]) => (
            <button
              key={label}
              className={tab === label ? "active" : ""}
              onClick={() => setTab(label)}
            >
              <Icon name={icon} />
              <span>{label}</span>
              {label === "طلبات الحجز" && counts.pending > 0 && (
                <i>{counts.pending}</i>
              )}
            </button>
          ))}
        </nav>
        <div className="clinic-status">
          <i />
          <div>
            <b>العيادة مفتوحة</b>
            <span>حتى 10:00 م</span>
          </div>
        </div>
        <button className="back-site" onClick={() => go("home")}>
          <Icon name="arrow" />
          <span>العودة للموقع</span>
        </button>
      </aside>
      <main className="dash-main">
        <header className="dash-topbar">
          <div>
            <span className="eyebrow">LUMA · بيانات تجريبية</span>
            <h1>{tab}</h1>
          </div>
          <div className="dash-user">
            <div>
              <b>فريق الاستقبال</b>
              <span>شارع النحاس، طنطا</span>
            </div>
            <span>لـ</span>
          </div>
        </header>
        {tab === "نظرة عامة" && (
          <Overview counts={counts} queue={queue} setTab={setTab} />
        )}
        {tab === "الطابور المباشر" && (
          <QueueManagement
            queue={queue}
            nowServing={nowServing}
            callNext={callNext}
            update={update}
            onWalkin={() => setModal("walkin")}
            onDetails={(p) => {
              setSelected(p)
              setModal("details")
            }}
          />
        )}
        {tab === "طلبات الحجز" && <Requests queue={queue} update={update} />}
        {!["نظرة عامة", "الطابور المباشر", "طلبات الحجز"].includes(tab) && (
          <Placeholder tab={tab} onWalkin={() => setModal("walkin")} />
        )}
      </main>
      {modal === "walkin" && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <form
            className="modal"
            onSubmit={addWalkin}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">إضافة للطابور الموحّد</span>
                <h2>تسجيل مريض حضور</h2>
              </div>
              <button type="button" onClick={() => setModal(null)}>
                <Icon name="close" />
              </button>
            </div>
            <label>
              اسم المريض
              <input
                value={walkName}
                onChange={(e) => setWalkName(e.target.value)}
                placeholder="الاسم بالكامل"
                autoFocus
              />
            </label>
            <label>
              رقم الموبايل <small>اختياري</small>
              <input placeholder="01xxxxxxxxx" />
            </label>
            <label>
              نوع الزيارة
              <select
                value={walkService}
                onChange={(e) => setWalkService(e.target.value)}
              >
                {visitTypes.slice(0, 4).map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              وقت الوصول
              <input
                value={new Date().toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                readOnly
              />
            </label>
            <div className="modal-note">
              <Icon name="users" /> سيتم إدخاله في نفس طابور د. آدم حسب وقت
              الوصول.
            </div>
            <Button type="submit">
              إضافة إلى الطابور <Icon name="plus" />
            </Button>
          </form>
        </div>
      )}
      {modal === "details" && selected && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <div
            className="modal details-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow">تفاصيل الحجز</span>
                <h2>المريض #{selected.id}</h2>
              </div>
              <button onClick={() => setModal(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="detail-grid">
              <div>
                <small>الاسم</small>
                <b>{selected.name}</b>
              </div>
              <div>
                <small>الهاتف</small>
                <b>{selected.phone ?? "غير مسجل"}</b>
              </div>
              <div>
                <small>الخدمة</small>
                <b>{selected.service}</b>
              </div>
              <div>
                <small>مصدر الوصول</small>
                <b>{selected.source}</b>
              </div>
              <div>
                <small>الحالة</small>
                <StatusBadge status={selected.status} />
              </div>
              <div>
                <small>تسجيل الوصول</small>
                <b>{selected.checkedIn ? "تم" : "لم يتم"}</b>
              </div>
            </div>
            <Button kind="secondary" onClick={() => setModal(null)}>
              إغلاق
            </Button>
          </div>
        </div>
      )}
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" />
          </span>
          {toast}
        </div>
      )}
    </div>
  )
}

function Overview({
  counts,
  queue,
  setTab,
}: {
  counts: Record<string, number>
  queue: Patient[]
  setTab: (s: string) => void
}) {
  return (
    <div className="dash-content stage-enter">
      <div className="metric-grid">
        {[
          ["المرضى المنتظرون", counts.waiting, "users", "+1 آخر ساعة"],
          ["داخل الكشف", counts.active, "sparkle", "غرفة 1"],
          ["اكتمل اليوم", 14, "check", "متوسط 24 د"],
          ["طلبات معلّقة", counts.pending, "file", "تحتاج مراجعة"],
          ["وصول متأخر", counts.late, "clock", "حسب السياسة"],
        ].map(([label, val, icon, hint]) => (
          <div className="metric-card" key={label as string}>
            <span>
              <Icon name={icon as string} />
            </span>
            <small>{label}</small>
            <b>{val}</b>
            <em>{hint}</em>
          </div>
        ))}
      </div>
      <div className="overview-grid">
        <section className="overview-queue">
          <div className="card-title">
            <div>
              <span className="eyebrow">لقطة مباشرة</span>
              <h2>الطابور الحالي</h2>
            </div>
            <button onClick={() => setTab("الطابور المباشر")}>
              إدارة الطابور <Icon name="arrow" />
            </button>
          </div>
          {queue.slice(0, 5).map((p) => (
            <div className="mini-patient" key={p.id}>
              <b>#{p.id}</b>
              <span>
                {p.name}
                <small>{p.service}</small>
              </span>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </section>
        <section className="fairness-card">
          <span className="eyebrow light">قرار النظام التالي</span>
          <h2>#126 هو التالي</h2>
          <p>
            لأن #125 لم يصل في وقت النداء وأصبح متأخرًا، بينما #126 حاضر ومسجّل.
            المريض #127 حاضر في موعده و#128 حضر مباشرة وسيأتي كل منهما حسب ترتيب
            الأهلية.
          </p>
          <div>
            <Icon name="shield" /> لا يتم تغيير الترتيب بصمت. كل قرار موثّق بسبب
            واضح.
          </div>
        </section>
      </div>
    </div>
  )
}

function QueueManagement({
  queue,
  nowServing,
  callNext,
  update,
  onWalkin,
  onDetails,
}: {
  queue: Patient[]
  nowServing: number
  callNext: () => void
  update: (id: number, s: QueueStatus, checked?: boolean) => void
  onWalkin: () => void
  onDetails: (p: Patient) => void
}) {
  return (
    <div className="dash-content stage-enter">
      <div className="queue-toolbar">
        <div className="doctor-chip">
          <span>أ ح</span>
          <div>
            <b>د. آدم حسن</b>
            <small>طابور موحّد · يتم الكشف #{nowServing}</small>
          </div>
        </div>
        <div>
          <Button kind="secondary" onClick={onWalkin}>
            <Icon name="plus" /> تسجيل حضور
          </Button>
          <Button onClick={callNext}>
            نداء المريض التالي <Icon name="volume" />
          </Button>
        </div>
      </div>
      <div className="rule-banner">
        <Icon name="shield" />
        <p>
          <b>قاعدة اليوم:</b> الوصول المتأخر يُخدم بعد مريضين جاهزين بحد أقصى،
          ولا يتخطى مريضًا حاضرًا تم النداء عليه. الأونلاين والحضور في طابور واحد.
        </p>
      </div>
      <div className="table-card">
        <div className="table-head">
          <div>
            <h2>قائمة اليوم</h2>
            <small>{queue.length} مرضى · بيانات تجريبية</small>
          </div>
          <div className="filter-chip">كل الحالات</div>
        </div>
        <div className="queue-table">
          <div className="table-row table-labels">
            <span>الرقم</span>
            <span>المريض</span>
            <span>نوع الزيارة</span>
            <span>المصدر</span>
            <span>الحالة</span>
            <span>الوصول</span>
            <span>الانتظار</span>
            <span>الإجراء</span>
          </div>
          {queue.map((p) => (
            <div
              className={`table-row ${p.status === "متأخر" ? "late-row" : ""}`}
              key={p.id}
            >
              <b className="q-num">#{p.id}</b>
              <span className="patient-name">
                {p.name}
                <small>{p.phone ?? "—"}</small>
              </span>
              <span>{p.service}</span>
              <span>
                <i
                  className={`source-dot ${p.source === "حضور" ? "walk" : ""}`}
                />
                {p.source}
              </span>
              <StatusBadge status={p.status} />
              <span>{p.checkedIn ? "تم التسجيل" : "لم يصل"}</span>
              <span>{p.wait}</span>
              <div className="row-actions">
                <button onClick={() => onDetails(p)} title="عرض التفاصيل">
                  •••
                </button>
                {p.status === "قيد المراجعة" && (
                  <button onClick={() => update(p.id, "مؤكد")}>تأكيد</button>
                )}
                {p.status === "مؤكد" && !p.checkedIn && (
                  <button onClick={() => update(p.id, "بانتظار الدخول", true)}>
                    وصل
                  </button>
                )}
                {p.status === "بانتظار الدخول" && (
                  <button onClick={() => update(p.id, "تم النداء")}>
                    نداء
                  </button>
                )}
                {p.status === "تم النداء" && (
                  <button onClick={() => update(p.id, "داخل الكشف")}>
                    ابدأ
                  </button>
                )}
                {p.status === "داخل الكشف" && (
                  <button onClick={() => update(p.id, "مكتمل")}>إنهاء</button>
                )}
                {p.status === "متأخر" && (
                  <button onClick={() => update(p.id, "بانتظار الدخول", true)}>
                    عاد
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Requests({
  queue,
  update,
}: {
  queue: Patient[]
  update: (id: number, s: QueueStatus) => void
}) {
  const requests = queue.filter((p) => p.source === "أونلاين")
  return (
    <div className="dash-content stage-enter">
      <div className="requests-head">
        <div>
          <span className="eyebrow">صندوق الطلبات</span>
          <h2>طلبات الحجز الأونلاين</h2>
          <p>راجع بيانات التواصل وحدد حالة الطلب قبل اعتباره مؤكدًا.</p>
        </div>
      </div>
      <div className="request-list">
        {requests.map((p) => (
          <article key={p.id}>
            <div className="request-number">#{p.id}</div>
            <div>
              <h3>{p.name}</h3>
              <span>{p.phone}</span>
            </div>
            <div>
              <small>نوع الزيارة</small>
              <b>{p.service}</b>
            </div>
            <StatusBadge status={p.status} />
            <div className="request-actions">
              {p.status === "قيد المراجعة" ? (
                <>
                  <Button onClick={() => update(p.id, "مؤكد")}>
                    تأكيد الطلب
                  </Button>
                  <Button kind="ghost" onClick={() => update(p.id, "ملغي")}>
                    رفض
                  </Button>
                </>
              ) : (
                <Button kind="secondary" onClick={() => undefined}>
                  إضافة ملاحظة
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Placeholder({ tab, onWalkin }: { tab: string onWalkin: () => void }) {
  return (
    <div className="dash-content empty-state stage-enter">
      <span>
        <Icon name={tab === "الحضور المباشر" ? "walk" : "settings"} size={34} />
      </span>
      <h2>{tab}</h2>
      <p>
        هذه الواجهة مهيأة ضمن النموذج وتعرض حالتها الفارغة بوضوح. إدارة الحالات
        الأساسية متاحة من شاشة الطابور المباشر.
      </p>
      {tab === "الحضور المباشر" && (
        <Button onClick={onWalkin}>
          <Icon name="plus" /> تسجيل مريض حضور
        </Button>
      )}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [queue, setQueue] = useState<Patient[]>(initialQueue)
  const [nowServing, setNowServing] = useState(124)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250)
    return () => window.clearTimeout(timer)
  }, [])
  const go = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const advance = () => setNowServing((n) => Math.min(129, n + 1))
  const addBooking = (patient: Patient) =>
    setQueue((q) => (q.some((p) => p.id === patient.id) ? q : [...q, patient]))
  if (loading)
    return (
      <div className="loader">
        <div className="tooth-draw">
          <svg viewBox="0 0 80 90">
            <path d="M21 12C10 21 13 39 20 54c5 11 5 25 12 25 5 0 4-18 9-18s4 18 9 18c7 0 7-14 12-25 7-15 10-33-1-42-7-6-13 2-20 2s-13-8-20-2Z" />
          </svg>
          <Icon name="sparkle" />
          <SmileMark />
        </div>
        <Logo />
        <span>تجربة أسنان أهدى</span>
      </div>
    )
  return (
    <div dir="rtl">
      {page === "home" && <Home go={go} nowServing={nowServing} />}
      {page === "booking" && <Booking go={go} addBooking={addBooking} />}
      {page === "track" && (
        <Track go={go} nowServing={nowServing} advance={advance} />
      )}
      {page === "display" && (
        <WaitingDisplay go={go} nowServing={nowServing} advance={advance} />
      )}
      {page === "dashboard" && (
        <Dashboard
          go={go}
          queue={queue}
          setQueue={setQueue}
          nowServing={nowServing}
          setNowServing={setNowServing}
        />
      )}
    </div>
  )
}
