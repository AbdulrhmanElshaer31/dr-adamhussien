import React, { useState, useEffect } from "react"
import { QueueStoreProvider } from "./store/queueStore"
import { HomePage } from "./pages/HomePage"
import { BookingPage } from "./pages/BookingPage"
import { PatientTrackPage } from "./pages/PatientTrackPage"
import { WaitingDisplayPage } from "./pages/WaitingDisplayPage"
import { ReceptionistDashboardPage } from "./pages/ReceptionistDashboardPage"
import { DoctorRoomPage } from "./pages/DoctorRoomPage"
import { PageName } from "./components/common/Header"
import { Logo, SmileMark } from "./components/common/Logo"
import { Sparkles } from "lucide-react"

function AppContent() {
  const [page, setPage] = useState<PageName>("home")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  const go = (p: PageName) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="loader" dir="rtl">
        <div className="tooth-draw">
          <svg viewBox="0 0 80 90">
            <path d="M21 12C10 21 13 39 20 54c5 11 5 25 12 25 5 0 4-18 9-18s4 18 9 18c7 0 7-14 12-25 7-15 10-33-1-42-7-6-13 2-20 2s-13-8-20-2Z" />
          </svg>
          <div className="loader-spark">
            <Sparkles size={24} />
          </div>
          <SmileMark />
        </div>
        <Logo subtitle="Dental Studio" />
        <span className="loader-sub">جاري تهيئة نظام العيادة الذكي...</span>
      </div>
    )
  }

  return (
    <div dir="rtl" className="luma-app-wrapper">
      {page === "home" && <HomePage go={go} />}
      {page === "booking" && <BookingPage go={go} />}
      {page === "track" && <PatientTrackPage go={go} />}
      {page === "display" && <WaitingDisplayPage go={go} />}
      {page === "dashboard" && <ReceptionistDashboardPage go={go} />}
      {page === "doctor" && <DoctorRoomPage go={go} />}
    </div>
  )
}

export default function App() {
  return (
    <QueueStoreProvider>
      <AppContent />
    </QueueStoreProvider>
  )
}
