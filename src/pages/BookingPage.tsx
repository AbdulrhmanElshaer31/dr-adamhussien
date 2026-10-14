import React, { useState, FormEvent } from "react"
import { useQueueStore } from "../store/queueStore"
import { Header } from "../components/common/Header"
import { Logo, SmileMark } from "../components/common/Logo"
import { StatusBadge } from "../components/common/StatusBadge"
import { VisitType, Booking } from "../types/clinic"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  Users,
  Printer,
  AlertTriangle,
} from "lucide-react"

const visitTypes: VisitType[] = [
  "كشف عام واستشارة",
  "تنظيف وتلميع الأسنان",
  "علاج الجذور وحشو العصب",
  "تجميل وعدسات الأسنان",
  "ألم أسنان / تقييم عاجل",
  "زراعة وتعويضات الأسنان",
]

export const BookingPage: React.FC<{ go: (page: any) => void }> = ({ go }) => {
  const { addOnlineBooking, nowServing, counts } = useQueueStore()

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<VisitType>("كشف عام واستشارة")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [createdBooking, setCreatedBooking] = useState<{
    booking: Booking
    ticketNumber: number
  } | null>(null)

  const handleNextDetails = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 3) {
      setError("من فضلك اكتب اسمك كاملاً (ثلاثي على الأقل).")
      return
    }
    const cleanPhone = phone.replace(/\s+/g, "")
    if (!/^01[0125]\d{8}$/.test(cleanPhone)) {
      setError("من فضلك أدخل رقم هاتف مصري صحيح يبدأ بـ 01 (11 رقماً).")
      return
    }
    setError("")
    setStep(3)
  }

  const handleSubmitBooking = () => {
    const result = addOnlineBooking(name, phone, selectedService, note)
    setCreatedBooking(result)
    setStep(4)
  }

  return (
    <div className="booking-page page-enter" dir="rtl">
      <Header currentPage="booking" go={go} />

      <main className="booking-shell">
        {/* Left / Side Brand Visual */}
        <aside className="booking-aside">
          <Logo light subtitle="حجز بدون حساب" />
          <div className="aside-text-block">
            <span className="eyebrow light">خطوات بسيطة وسريعة</span>
            <h2>
              تجربة حجز هادئة،
              <br />
              من أول لمسة.
            </h2>
            <p>
              حدد سبب زيارتك، واستلم تذكرتك الرقمية فوراً للمتابعة دون الحاجة لإنشاء
              حساب أو تذكر كلمات مرور.
            </p>
          </div>
          <SmileMark light />
          <small className="aside-privacy-hint">
            بياناتك الشخصية تُستخدم فقط للتواصل الطبي والتنظيم الداخلي للعيادة.
          </small>
        </aside>

        {/* Right / Main Form Flow */}
        <section className="booking-main">
          {/* Top navigation inside form */}
          <div className="booking-top">
            <button
              className="back-btn"
              onClick={() => (step > 1 && step < 4 ? setStep(step - 1) : go("home"))}
            >
              <ArrowRight size={16} />
              {step === 1 ? "العودة للرئيسية" : "السابق"}
            </button>
            <span className="step-counter">الخطوة {Math.min(step, 4)} من 4</span>
          </div>

          {/* Progress Line */}
          <div className="progress">
            <i style={{ width: `${step * 25}%` }} />
          </div>

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="form-stage stage-enter">
              <span className="eyebrow">الخطوة 1: نوع الزيارة</span>
              <h1>ما هو سبب زيارتك اليوم؟</h1>
              <p>اختر الخدمة الأقرب لاحتياجك، وسيؤكد الطبيب التشخيص الشامل أثناء الزيارة.</p>

              <div className="visit-options">
                {visitTypes.map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    className={selectedService === v ? "selected" : ""}
                    onClick={() => setSelectedService(v)}
                  >
                    <span className="opt-num">0{i + 1}</span>
                    <b className="opt-title">{v}</b>
                    <i className="opt-check">
                      {selectedService === v && <Check size={16} />}
                    </i>
                  </button>
                ))}
              </div>

              {selectedService === "ألم أسنان / تقييم عاجل" && (
                <div className="urgent-note">
                  <AlertTriangle size={20} />
                  <div>
                    <b>تنبيه طبي عاجل</b>
                    <p>
                      الحجز الإلكتروني مخصص للحالات المستقرة. في حال وجود تورم حاد بالوجه
                      أو نزيف لا يتوقف، يرجى الاتصال فوراً بالعيادة أو التوجه لأقرب طوارئ.
                    </p>
                  </div>
                </div>
              )}

              <button
                className="btn btn-primary btn-full mt-4"
                onClick={() => setStep(2)}
              >
                المتابعة: إدخال البيانات
                <ArrowLeft size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: Patient Info */}
          {step === 2 && (
            <form className="form-stage stage-enter" onSubmit={handleNextDetails}>
              <span className="eyebrow">الخطوة 2: بيانات المريض</span>
              <h1>كيف نتواصل معك؟</h1>
              <p>بيانات أساسية وسريعة لتسجيل حجزك واستلام إشعار الدور.</p>

              <label>
                الاسم بالكامل
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد محمد علي"
                  required
                />
              </label>

              <label>
                رقم الهاتف المحمول (مصر)
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  required
                />
              </label>

              <label>
                ملاحظة للطبيب أو العيادة <small>(اختياري)</small>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="مثال: أفضل الحضور بعد الساعة 6 مساءً، أو أي حساسية دوائية سابقة"
                  rows={3}
                />
              </label>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-full">
                مراجعة وتأكيد الطلب
                <ArrowLeft size={16} />
              </button>
            </form>
          )}

          {/* STEP 3: Review Snapshot */}
          {step === 3 && (
            <div className="form-stage stage-enter review-stage">
              <span className="eyebrow">الخطوة 3: ملخص الحجز والعيادة</span>
              <h1>حالة العيادة اليوم</h1>
              <p>العيادة تستقبل المرضى بانتظام وتُراجع الطلبات الجديدة فوراً.</p>

              <div className="queue-snapshot">
                <div>
                  <span className="live-dot" />
                  <small>الكشف الحالي</small>
                  <b>{nowServing ? `#${nowServing}` : "جاهز"}</b>
                </div>
                <div>
                  <Users size={16} />
                  <small>في الانتظار الآن</small>
                  <b>{counts.waiting} مرضى</b>
                </div>
                <div>
                  <Clock size={16} />
                  <small>الانتظار التقريبي</small>
                  <b>15–30 دقيقة</b>
                </div>
              </div>

              <div className="request-summary">
                <h3>بيانات الطلب</h3>
                <div>
                  <span>الاسم:</span>
                  <b>{name}</b>
                </div>
                <div>
                  <span>الهاتف:</span>
                  <b>{phone}</b>
                </div>
                <div>
                  <span>نوع الزيارة:</span>
                  <b>{selectedService}</b>
                </div>
                <div>
                  <span>الحالة المبدئية:</span>
                  <StatusBadge status="pending" />
                </div>
              </div>

              <div className="policy-short">
                <Clock size={18} />
                <p>
                  <b>سياسة الدور:</b> طلبك يدخل قيد المراجعة لدى السكرتارية. فور
                  التأكيد، يُخصص لك ترتيبك، وتُمنح مهلة 10 دقائق سماح عند النداء.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handleSubmitBooking}
              >
                إرسال طلب الحجز
                <Check size={16} />
              </button>
            </div>
          )}

          {/* STEP 4: Digital Ticket */}
          {step === 4 && createdBooking && (
            <div className="ticket-stage stage-enter">
              <div className="success-spark">
                <Sparkles size={28} />
              </div>

              <span className="eyebrow">تم إرسال طلبك بنجاح!</span>
              <h1>تذكرتك الرقمية جاهزة</h1>
              <p>طلبك قيد مراجعة موظف الاستقبال لتأكيد الحضور.</p>

              {/* Printable Ticket */}
              <div className="digital-ticket">
                <div className="ticket-head">
                  <Logo subtitle="تذكرة حجز إلكترونية" />
                  <StatusBadge status="pending" />
                </div>

                <div className="ticket-number">
                  <small>رقم الدور المقترح اليوم</small>
                  <strong>#{createdBooking.ticketNumber}</strong>
                  <SmileMark className="ticket-bg-smile" />
                </div>

                <div className="ticket-data">
                  <div>
                    <small>المرجع الثابت</small>
                    <b>{createdBooking.booking.reference}</b>
                  </div>
                  <div>
                    <small>نوع الزيارة</small>
                    <b>{createdBooking.booking.service}</b>
                  </div>
                  <div>
                    <small>مواعيد العيادة</small>
                    <b>2 ظ – 10 م</b>
                  </div>
                  <div className="qr" aria-label="رمز QR للمتابعة">
                    <span className="qr-txt">LUMA</span>
                  </div>
                </div>

                <small className="ticket-hint">
                  المرجع الثابت ثابت لحجزك، أما الترتيب المباشر فيتحدث تلقائياً حسب حركة
                  الكشوفات داخل العيادة.
                </small>
              </div>

              <div className="ticket-actions">
                <button className="btn btn-primary" onClick={() => go("track")}>
                  تابع دورك المباشر
                  <ArrowLeft size={16} />
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                  طباعة التذكرة
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
