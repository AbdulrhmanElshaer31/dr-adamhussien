import React, { useState } from "react"
import { useQueueStore } from "../store/queueStore"
import { Header, PageName } from "../components/common/Header"
import { Logo, SmileMark } from "../components/common/Logo"
import { VisitType } from "../types/clinic"
import {
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Smile,
  Zap,
  Activity,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Unified High-End Clinical Dental Photography (Dr. Adam Hussein Studio Portrait)
const doctorHeroPhoto = "/doctor-adam-clean.jpg"
const doctorPortraitPhoto = "/doctor-adam-clean.jpg"
const clinicSuitePhoto =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
const equipmentPhoto =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80"
const smilePhoto =
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80"
const microscopePhoto =
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80"

interface ServiceItem {
  id: string
  num: string
  title: VisitType
  tag: string
  shortDesc: string
  sessionTime: string
  comfortLevel: string
  image: string
}

const servicesList: ServiceItem[] = [
  {
    id: "checkup",
    num: "01",
    title: "كشف عام واستشارة",
    tag: "تشخيص رقمي",
    shortDesc: "فحص شامل لصحة الأسنان واللثة بكاميرا الفم الدقيقة، مع وضع خطة علاج ومواعيد واضحة تناسبك.",
    sessionTime: "20 دقيقة",
    comfortLevel: "مريح وبدون ألم",
    image: clinicSuitePhoto,
  },
  {
    id: "clean",
    num: "02",
    title: "تنظيف وتلميع الأسنان",
    tag: "عناية وقائية",
    shortDesc: "إزالة لطيفة للجير والتصبغات بأحدث موجات الكافيترون لحماية اللثة واستعادة بياض ونضارة ابتسامتك.",
    sessionTime: "30 دقيقة",
    comfortLevel: "تلميع ناعم لطيف",
    image: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "veneers",
    num: "03",
    title: "تجميل وعدسات الأسنان",
    tag: "تصميم الابتسامة",
    shortDesc: "تصميم رقمي ثلاثي الأبعاد وعدسات E-max فائقة النقاء تمنحك ابتسامة هوليود متناسقة وطبيعية المظهر.",
    sessionTime: "جلستان فقط",
    comfortLevel: "بدون برد مفرط",
    image: smilePhoto,
  },
  {
    id: "root",
    num: "04",
    title: "علاج الجذور وحشو العصب",
    tag: "بالميكروسكوب",
    shortDesc: "علاج القنوات الدقيقة بالميكروسكوب وأجهزة الروتاري في جلسة واحدة غالباً لتسكين فوري للألم وإنقاذ السن.",
    sessionTime: "45 دقيقة",
    comfortLevel: "تخدير موضعي كامل",
    image: microscopePhoto,
  },
  {
    id: "implants",
    num: "05",
    title: "زراعة وتعويضات الأسنان",
    tag: "زراعة رقمية",
    shortDesc: "استعادة الأسنان المفقودة بزرعات تيتانيوم ألمانية وسويسرية معتمدة تندمج ثابتاً لتدوم مدى الحياة.",
    sessionTime: "30 دقيقة",
    comfortLevel: "دليل جراحي دقيق",
    image: equipmentPhoto,
  },
  {
    id: "urgent",
    num: "06",
    title: "ألم أسنان / تقييم عاجل",
    tag: "تدخل سريع",
    shortDesc: "بروتوكول إسعافي عاجل لتشخيص الآلام المفاجئة وتسكينها تحت إشراف د. آدم حسين وفريقه.",
    sessionTime: "أولوية فورية",
    comfortLevel: "تسكين فوري",
    image: doctorHeroPhoto,
  },
]

export const HomePage: React.FC<{ go: (page: PageName) => void }> = ({ go }) => {
  const { clinic, nowServing, counts } = useQueueStore()
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const filteredServices =
    activeCategory === "all"
      ? servicesList
      : activeCategory === "cosmetic"
        ? servicesList.filter((s) => s.id === "veneers" || s.id === "clean")
        : servicesList.filter((s) => s.id === "root" || s.id === "implants" || s.id === "urgent")

  const faqs = [
    {
      q: "كيف يعمل نظام الطابور المباشر إذا كنت قادماً للعيادة من خارج طنطا؟",
      a: "بمجرد تأكيد طلبك، تتابع رقمك والدور الحالي مباشرة من هاتفك عبر شاشة التتبع. ننصحك بالوصول عند بقاء مريضين قبلك (حوالي 20 دقيقة قبل موعدك).",
    },
    {
      q: "ماذا يحدث لو تأخرت عن موعد النداء على رقمي؟",
      a: "النظام يمنحك مهلة 10 دقائق سماح كاملة بعد النداء. وفي حال التأخر، لا يُلغى حجزك، بل يُعاد إدراجك في قائمة الوصول المتأخر وتُخدم بعد مريضين جاهزين حفاظاً على العدالة.",
    },
    {
      q: "هل علاج الجذور والزراعة مؤلم في عيادة د. آدم حسين؟",
      a: "نعتمد نظام التخدير الحاسوبي بدون وخز مؤلم، مع الميكروسكوب الجراحي الدقيق الذي يختصر وقت الجلسة ويضمن راحة تامة طوال مدة الكشف.",
    },
    {
      q: "هل يتطلب حجز موعد كشف إنشاء حساب وكلمة مرور؟",
      a: "لا على الإطلاق. الحجز يتم بالاسم ورقم الهاتف فقط في أقل من دقيقة، وتستلم تذكرتك الرقمية وكودك الثابت فوراً.",
    },
  ]

  return (
    <div className="page-enter" dir="rtl">
      <Header currentPage="home" go={go} />

      <main>
        {/* ---------------------------------------------------------------- */}
        {/* 1. HERO SECTION                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section className="hero">
          <div className="hero-grain" />
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <span className="eyebrow">
                <span className="live-dot" /> استشاري زراعة وتجميل الأسنان · طنطا
              </span>

              <h1>
                ابتسامتك تستحق
                <br />
                <em>خبرة طبية حقيقية وتجربة هادئة.</em>
              </h1>

              <p className="hero-lead-text">
                نظام حجز ذكي بدون انتظار عشوائي. احجز زيارتك في ثوانٍ، تابع دورك لحظة
                بلحظة من هاتفك، واستمتع برعاية متقدمة مع الدكتور آدم حسين تضمن
                لك الراحة التامة والابتسامة الطبيعية التي تحلم بها.
              </p>

              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => go("booking")}>
                  احجز زيارتك الآن
                  <ArrowLeft size={16} />
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => go("track")}
                >
                  تابع دورك المباشر
                </button>
              </div>

              <div className="hero-meta">
                <span>
                  <MapPin size={16} /> {clinic.address}، {clinic.city}
                </span>
                <a href={`tel:${clinic.phone}`}>
                  <Phone size={16} /> {clinic.phone}
                </a>
              </div>
            </div>

            <div className="hero-visual reveal-delay">
              <div className="hero-image">
                <img
                  src={doctorHeroPhoto}
                  alt="د. آدم حسين استشاري جراحة وتجميل وزراعة الأسنان"
                />
              </div>

              {/* Doctor Quick Badge */}
              <div className="float-card appointment-card">
                <span className="mini-icon">
                  <Calendar size={18} />
                </span>
                <div>
                  <small>استشاري العيادة</small>
                  <b>{clinic.doctorName}</b>
                  <span>السبت – الخميس · 2 ظ – 10 م</span>
                </div>
                <span className="check-circle">
                  <CheckCircle2 size={16} />
                </span>
              </div>

              {/* Live Queue Floating Card */}
              <div className="float-card queue-card">
                <div className="queue-title">
                  <span>
                    <i className="live-dot" /> حركة الطابور المباشرة
                  </span>
                  <small>محدث الآن</small>
                </div>
                <div className="queue-numbers">
                  <div>
                    <small>الكشف الحالي</small>
                    <b>{nowServing ? `#${nowServing}` : "جاهز"}</b>
                  </div>
                  <div>
                    <small>في الانتظار</small>
                    <b>{counts.waiting} مرضى</b>
                  </div>
                </div>
                <div className="wait-row">
                  <Clock size={16} />
                  <span>الانتظار التقريبي للدور:</span>
                  <b>15–20 دقيقة</b>
                </div>
              </div>

              <div className="hero-smile">
                <SmileMark light />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. DOCTOR CAMPAIGN SHOWCASE (EDITORIAL ADS)                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="doctor-campaign-section">
          <div className="container">
            <div className="campaign-head">
              <span className="eyebrow">رؤية وخبرة استشارية رائدة</span>
              <h2>معايير طبية تمنحك الأمان والاطمئنان في كل زيارة</h2>
            </div>

            <div className="campaign-grid">
              {/* Main Banner Card */}
              <article className="campaign-card main-campaign">
                <div className="campaign-image-wrap">
                  <img
                    src={doctorPortraitPhoto}
                    alt="د. آدم حسين استشاري جراحة وتجميل وزراعة الأسنان"
                  />
                  <div className="campaign-overlay" />
                </div>
                <div className="campaign-content">
                  <span className="campaign-tag">
                    <Award size={14} /> رائد تجميل وزراعة الأسنان في مصر
                  </span>
                  <h3>د. آدم حسين — خبرة سريرية متقدمة وتشخيص رقمي دقيق</h3>
                  <p>
                    استشاري جراحة وتجميل وزراعة الأسنان، بخبرة تزيد عن 15 عاماً في زراعة الأسنان
                    وتصميم الابتسامة وعلاج الجذور بالميكروسكوب. نؤمن بأن كل مريض يستحق رعاية فردية
                    وخطة مفصلة تمنحه الراحة وتصون أسنانه الطبيعية.
                  </p>
                  <div className="campaign-stats">
                    <div>
                      <strong>+15,000</strong>
                      <small>ابتسامة وزراعة ناجحة</small>
                    </div>
                    <div>
                      <strong>99.6%</strong>
                      <small>معدل رضا وراحة المرضى</small>
                    </div>
                  </div>
                </div>
              </article>

              {/* Tech Side Card */}
              <article className="campaign-card tech-campaign">
                <div className="campaign-content">
                  <span className="campaign-tag light">
                    <Zap size={14} /> تعقيم معتمد وتكنولوجيا أوروبية
                  </span>
                  <h3>أجهزة أوتوكلاف Class B وتصوير مجهري</h3>
                  <p>
                    تعقيم صارم بأعلى المعايير لكل مريض، وأحدث تقنيات التصوير ثلاثي
                    الأبعاد لضمان تشخيص قاطع وراحة لا مثيل لها.
                  </p>
                  <ul className="campaign-checklist">
                    <li>
                      <CheckCircle2 size={16} /> تخدير إلكتروني حاسوبي بدون ألم
                    </li>
                    <li>
                      <CheckCircle2 size={16} /> علاج الجذور بالميكروسكوب في جلسة واحدة
                    </li>
                  </ul>
                </div>
                <div className="campaign-side-img">
                  <img src={equipmentPhoto} alt="تجهيزات العيادة الحديثة" />
                </div>
              </article>

              {/* Natural Smile Card */}
              <article className="campaign-card promise-campaign">
                <div className="campaign-content">
                  <span className="campaign-tag gold">
                    <Smile size={14} /> تصميم الابتسامة الطبيعية
                  </span>
                  <h3>عدسات E-max متناسقة مع ملامح وجهك</h3>
                  <p>
                    نبتعد تماماً عن المظهر المصطنع، ونعتمد التصميم الرقمي (DSD) لمطابقة
                    ابتسامتك مع حركة شفتيك وتفاصيل وجهك بدقة وأناقة.
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => go("booking")}
                  >
                    احجز استشارة تجميلية
                    <ArrowLeft size={14} />
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 3. SPECIALIZED SERVICES (SPACIOUS, UNCLUTTERED, READABLE)        */}
        {/* ---------------------------------------------------------------- */}
        <section className="section services-modern-section" id="services">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">خدماتنا التخصصية</span>
                <h2>
                  علاجات أسنان متكاملة،
                  <br />
                  <em>بأعلى معايير الدقة والراحة.</em>
                </h2>
              </div>
              <p>
                عناية طبية فائقة يشرف عليها د. آدم حسين، مع خطة علاج مفهومة ومريحة
                تضمن لك نتائج تدوم طويلاً.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="services-filter-bar">
              <button
                className={`filter-btn ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                كافة الخدمات (6)
              </button>
              <button
                className={`filter-btn ${activeCategory === "cosmetic" ? "active" : ""}`}
                onClick={() => setActiveCategory("cosmetic")}
              >
                تجميل وتبييض وتنظيف
              </button>
              <button
                className={`filter-btn ${activeCategory === "surgical" ? "active" : ""}`}
                onClick={() => setActiveCategory("surgical")}
              >
                علاج جذور وزراعة وطوارئ
              </button>
            </div>

            {/* Services Cards (Clean, Spacious, Uncluttered) */}
            <div className="clean-services-grid">
              {filteredServices.map((service) => (
                <article key={service.id} className="clean-service-card">
                  {/* Photo header */}
                  <div className="clean-card-image">
                    <img src={service.image} alt={service.title} />
                    <span className="clean-tag">{service.tag}</span>
                    <span className="clean-num">{service.num}</span>
                  </div>

                  {/* Clean text body */}
                  <div className="clean-card-body">
                    <h3>{service.title}</h3>
                    <p className="clean-desc">{service.shortDesc}</p>

                    <div className="clean-specs-row">
                      <div className="spec-item">
                        <Clock size={14} />
                        <span>المدة: <b>{service.sessionTime}</b></span>
                      </div>
                      <div className="spec-item">
                        <ShieldCheck size={14} />
                        <span>الراحة: <b>{service.comfortLevel}</b></span>
                      </div>
                    </div>

                    <button
                      className="btn btn-secondary btn-full clean-action-btn"
                      onClick={() => go("booking")}
                    >
                      احجز هذه الخدمة
                      <ArrowLeft size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 4. DOCTOR PROFILE & CREDENTIALS DEEP DIVE                        */}
        {/* ---------------------------------------------------------------- */}
        <section className="section doctor-spotlight-section" id="doctor">
          <div className="container doctor-grid">
            <div className="doctor-visual-col">
              <div className="doctor-framed-photo">
                <img
                  src={doctorPortraitPhoto}
                  alt="د. آدم حسين استشاري جراحة وتجميل وزراعة الأسنان"
                />
                <div className="experience-badge">
                  <strong>18+</strong>
                  <span>عاماً من الريادة والتميز الطبي</span>
                </div>
              </div>

              <div className="clinic-mini-preview">
                <img src={clinicSuitePhoto} alt="غرفة الكشف والعلاج بالعيادة" />
                <div className="preview-label">
                  <MapPin size={14} /> عيادة طنطا — شارع النحاس، برج الأطباء
                </div>
              </div>
            </div>

            <div className="doctor-bio-col">
              <span className="eyebrow">طبيبك الاستشاري</span>
              <h2>{clinic.doctorName}</h2>
              <h3 className="doctor-sub">{clinic.doctorTitle}</h3>

              <p className="lead-bio">
                "زيارة طبيب الأسنان يجب أن تكون لحظة راحة واطمئنان، وليست مصدر توتر.
                مهمتي الأولى هي الاستماع لاحتياجك، وشرح الخيارات بمصداقية وشفافية، مع
                استخدام أحدث أجهزة الميكروسكوب والتعقيم لنمنحك ابتسامة صحية وواثقة تدوم
                طوال العمر."
              </p>

              <div className="credentials-bento">
                <div className="cred-item">
                  <Award size={20} />
                  <div>
                    <b>زميل الكونجرس العالمي لزراعة الأسنان (ICOI)</b>
                    <small>أعلى اعتماد دولي لجراحات وزراعة الأسنان الموجهة</small>
                  </div>
                </div>

                <div className="cred-item">
                  <Smile size={20} />
                  <div>
                    <b>عضو الجمعية الأمريكية لتجميل الأسنان (AACD)</b>
                    <small>تصميم ابتسامة هوليود الرقمية ومحاكاة الأسنان الطبيعية</small>
                  </div>
                </div>

                <div className="cred-item">
                  <Stethoscope size={20} />
                  <div>
                    <b>رئيس مركز LUMA لطب وجراحة وتجميل الأسنان</b>
                    <small>وجهة موثوقة لأبرز الشخصيات والعائلات الباحثة عن الراحة والدقة</small>
                  </div>
                </div>
              </div>

              <div className="doctor-hours-box">
                <Clock size={20} />
                <div>
                  <b>مواعيد الكشف بالعيادة</b>
                  <span>{clinic.workingHours} (الحجز المسبق يضمن أسبقية الدور)</span>
                </div>
              </div>

              <div className="doctor-cta-row">
                <button className="btn btn-primary" onClick={() => go("booking")}>
                  احجز موعد كشف مع الطبيب
                  <ArrowLeft size={16} />
                </button>
                <a href={`tel:${clinic.phone}`} className="btn btn-secondary">
                  <Phone size={16} /> اتصال مباشر بالعيادة
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 5. PATIENT TESTIMONIALS                                          */}
        {/* ---------------------------------------------------------------- */}
        <section className="section testimonials-section">
          <div className="container">
            <div className="center-head">
              <span className="eyebrow">آراء المرضى وتجاربهم</span>
              <h2>ثقة متبادلة وتجارب علاج هادئة ومريحة</h2>
            </div>

            <div className="testimonials-grid">
              <div className="testi-card">
                <div className="testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#E9C8A9" color="#E9C8A9" />
                  ))}
                </div>
                <p>
                  "أول مرة في حياتي أدخل عيادة أسنان وما استناش ولا دقيقة زيادة! تابعت دوري
                  من الموبايل ودخلت الكشف في معادي بالظبط. د. آدم قمة في الذوق والشطارة والمهنية."
                </p>
                <div className="testi-author">
                  <b>م. كريم الشربيني</b>
                  <small>تنظيف وتبييض أسنان</small>
                </div>
              </div>

              <div className="testi-card featured">
                <div className="testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#E9C8A9" color="#E9C8A9" />
                  ))}
                </div>
                <p>
                  "عالجت عصب الضرس بالميكروسكوب في جلسة واحدة من غير أي ألم نهائي.
                  التعقيم والنظافة والهدوء في العيادة حاجة تشرف بجد."
                </p>
                <div className="testi-author">
                  <b>د. هدى الدسوقي</b>
                  <small>علاج جذور وحشو تجميلي</small>
                </div>
              </div>

              <div className="testi-card">
                <div className="testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#E9C8A9" color="#E9C8A9" />
                  ))}
                </div>
                <p>
                  "عملت عدسات تجميلية للأسنان، النتيجة طبيعية جداً ومش مصطنعة. نظام
                  الحجز واستقبال السكرتيرة محترم وسريع جداً."
                </p>
                <div className="testi-author">
                  <b>ريهام عبد الرحيم</b>
                  <small>تجميل وتصميم ابتسامة E-max</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 6. FAQ ACCORDION                                                 */}
        {/* ---------------------------------------------------------------- */}
        <section className="section faq-section">
          <div className="container faq-container">
            <div className="center-head">
              <span className="eyebrow">الأسئلة الشائعة</span>
              <h2>كل ما يهمك معرفته قبل زيارتك للعيادة</h2>
            </div>

            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`faq-item ${openFaq === idx ? "open" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 7. LIVE QUEUE CALL TO ACTION STRIP                               */}
        {/* ---------------------------------------------------------------- */}
        <section className="section queue-preview">
          <div className="container preview-card">
            <div className="preview-copy">
              <span className="eyebrow light">تنظيم ذكي للوقت</span>
              <h2>
                دورك واضح،
                <br />
                ووقتك محفوظ.
              </h2>
              <p>
                لا داعي للجلوس لساعات في صالة الانتظار. تابع تقدم الكشوفات مباشرة
                وتعرف على فترة السماح (10 دقائق) بكل شفافية.
              </p>

              <button
                className="btn btn-secondary"
                onClick={() => go("track")}
              >
                افتح شاشة متابعة الدور المباشرة
                <ArrowLeft size={16} />
              </button>

              <small>الأوقات تقديرية وفقاً لطبيعة كل إجراء طبي.</small>
            </div>

            <div className="preview-panel">
              <div className="panel-top">
                <span>
                  <i className="live-dot" /> بث مباشر لحركة الطابور
                </span>
                <small>محدث الآن</small>
              </div>

              <div className="now-number">
                <small>يتم الكشف الآن</small>
                <strong>{nowServing ? `#${nowServing}` : "جاهز"}</strong>
                <span>غرفة الكشف 1 · {clinic.doctorName}</span>
              </div>

              <div className="upcoming">
                <div>
                  <small>مكتمل اليوم</small>
                  <b>{counts.completedToday}</b>
                </div>
                <div className="your-number">
                  <small>في الانتظار</small>
                  <b>{counts.waiting}</b>
                </div>
                <div>
                  <small>متأخرون</small>
                  <b>{counts.lateCount}</b>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer id="contact">
        <div className="container footer-top">
          <div className="footer-cta">
            <Logo light />
            <h2>
              جاهز لتجربة أسنان
              <br />
              أكثر راحة وطمأنينة؟
            </h2>
            <button
              className="btn btn-secondary mt-4"
              onClick={() => go("booking")}
            >
              احجز زيارتك الآن
            </button>
          </div>

          <div className="footer-info">
            <div>
              <b>موقع العيادة</b>
              <span>{clinic.address}</span>
              <span>{clinic.city}</span>
            </div>

            <div>
              <b>للحجز والاستفسار</b>
              <a href={`tel:${clinic.phone}`}>{clinic.phone}</a>
              <span>info@lumadental.demo</span>
            </div>

            <div>
              <b>أوقات العمل</b>
              <span>{clinic.workingHours}</span>
              <span>الجمعة: عطلة أسبوعية</span>
            </div>

            <div>
              <b>شاشات النظام المترابطة</b>
              <button onClick={() => go("track")}>شاشة المريض (Track)</button>
              <button onClick={() => go("display")}>شاشة التلفزيون (TV)</button>
              <button onClick={() => go("dashboard")}>لوحة الاستقبال</button>
              <button onClick={() => go("doctor")}>لوحة غرفة الطبيب</button>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 LUMA Dental Studio — بإشراف د. آدم حسين</span>
          <span>صُمم لراحة المرضى وكفاءة العيادة.</span>
        </div>
      </footer>
    </div>
  )
}
