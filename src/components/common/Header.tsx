import React, { useState, useEffect } from "react"
import { Logo } from "./Logo"
import {
  Menu,
  X,
  ArrowLeft,
  Tv,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Smile,
  Award,
  Phone,
  Clock,
  MapPin,
} from "lucide-react"

export type PageName = "home" | "booking" | "track" | "display" | "dashboard" | "doctor"

interface HeaderProps {
  currentPage: PageName
  go: (page: PageName) => void
}

export const Header: React.FC<HeaderProps> = ({ currentPage, go }) => {
  const [open, setOpen] = useState(false)

  const nav = (p: PageName) => {
    go(p)
    setOpen(false)
  }

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <header className="site-header">
        <nav className="container nav-wrap" aria-label="التنقل الرئيسي">
          <button
            className="logo-button"
            onClick={() => nav("home")}
            aria-label="العودة للرئيسية"
          >
            <Logo />
          </button>

          {/* Desktop Navigation Links */}
          <div className="nav-links desktop-nav">
            <button
              className={currentPage === "home" ? "active" : ""}
              onClick={() => nav("home")}
            >
              الرئيسية
            </button>
            <a href="#services">الخدمات</a>
            <a href="#doctor">طبيبنا</a>
            <a href="#how">تجربة الحجز</a>
            <a href="#contact">تواصل معنا</a>

            <span className="nav-divider" />

            <button
              className={`track-link ${currentPage === "track" ? "active" : ""}`}
              onClick={() => nav("track")}
            >
              تابع دورك
            </button>

            <button
              className="system-shortcut"
              onClick={() => nav("display")}
              title="شاشة الانتظار للتلفزيون"
            >
              <Tv size={15} />
              <span>شاشة العرض</span>
            </button>

            <button
              className="system-shortcut"
              onClick={() => nav("dashboard")}
              title="لوحة تحكم السكرتارية"
            >
              <ShieldCheck size={15} />
              <span>الاستقبال</span>
            </button>

            <button
              className="system-shortcut"
              onClick={() => nav("doctor")}
              title="لوحة الطبيب داخل غرفة الكشف"
            >
              <Stethoscope size={15} />
              <span>الطبيب</span>
            </button>

            <button className="btn btn-primary" onClick={() => nav("booking")}>
              احجز زيارتك
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </header>

      {/* Luxury Mobile Navigation Drawer & Backdrop */}
      <div
        className={`mobile-nav-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`mobile-nav-drawer ${open ? "open" : ""}`} dir="rtl">
        <div className="mobile-drawer-header">
          <Logo subtitle="Dental Studio" />
          <button
            className="mobile-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mobile-drawer-content">
          {/* Group 1: Main Pages */}
          <div className="drawer-group">
            <span className="drawer-group-title">أقسام الموقع الرئيسي</span>
            <div className="drawer-links-grid">
              <button
                className={`drawer-link ${currentPage === "home" ? "active" : ""}`}
                onClick={() => nav("home")}
              >
                <Sparkles size={18} />
                <span>الرئيسية</span>
              </button>
              <a
                href="#services"
                className="drawer-link"
                onClick={() => setOpen(false)}
              >
                <Smile size={18} />
                <span>الخدمات التخصصية</span>
              </a>
              <a
                href="#doctor"
                className="drawer-link"
                onClick={() => setOpen(false)}
              >
                <Award size={18} />
                <span>د. آدم حسين (طبيبنا)</span>
              </a>
              <a
                href="#contact"
                className="drawer-link"
                onClick={() => setOpen(false)}
              >
                <Phone size={18} />
                <span>تواصل معنا</span>
              </a>
            </div>
          </div>

          {/* Group 2: Live Clinic Systems */}
          <div className="drawer-group">
            <span className="drawer-group-title">شاشات النظام المباشرة (Live Demo)</span>
            <div className="drawer-systems-grid">
              <button
                className={`drawer-sys-card ${currentPage === "track" ? "active" : ""}`}
                onClick={() => nav("track")}
              >
                <div className="sys-icon-wrap live">
                  <Clock size={18} />
                </div>
                <div className="sys-text-wrap">
                  <b>شاشة تتبع المريض (Patient App)</b>
                  <small>متابعة حركة الدور والوقت اللحظي من الهاتف</small>
                </div>
              </button>

              <button
                className={`drawer-sys-card ${currentPage === "display" ? "active" : ""}`}
                onClick={() => nav("display")}
              >
                <div className="sys-icon-wrap">
                  <Tv size={18} />
                </div>
                <div className="sys-text-wrap">
                  <b>شاشة صالة الانتظار (TV Display)</b>
                  <small>شاشة التلفزيون الكبيرة للأدوار الحالية والقادمة</small>
                </div>
              </button>

              <button
                className={`drawer-sys-card ${currentPage === "dashboard" ? "active" : ""}`}
                onClick={() => nav("dashboard")}
              >
                <div className="sys-icon-wrap">
                  <ShieldCheck size={18} />
                </div>
                <div className="sys-text-wrap">
                  <b>لوحة إدارة الاستقبال (Workstation)</b>
                  <small>محطة السكرتيرة، تسجيل الحضور، والنداء الآلي</small>
                </div>
              </button>

              <button
                className={`drawer-sys-card ${currentPage === "doctor" ? "active" : ""}`}
                onClick={() => nav("doctor")}
              >
                <div className="sys-icon-wrap">
                  <Stethoscope size={18} />
                </div>
                <div className="sys-text-wrap">
                  <b>لوحة غرفة الطبيب (Doctor Suite)</b>
                  <small>متابعة الكرسي الطبي وبدء وإنهاء الكشف</small>
                </div>
              </button>
            </div>
          </div>

          {/* Group 3: Primary Booking CTA */}
          <div className="drawer-cta-wrap">
            <button
              className="btn btn-primary btn-full drawer-booking-btn"
              onClick={() => nav("booking")}
            >
              احجز زيارتك الآن
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Group 4: Quick Contact Info */}
          <div className="drawer-clinic-footer">
            <div>
              <MapPin size={15} />
              <span>طنطا · شارع النحاس، برج الأطباء</span>
            </div>
            <div>
              <Phone size={15} />
              <a href="tel:01023143535">01023143535</a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
