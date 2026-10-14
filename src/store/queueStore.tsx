import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react"
import {
  Booking,
  ClinicInfo,
  QueueEntry,
  QueueStatus,
  VisitType,
} from "../types/clinic"
import {
  defaultClinicInfo,
  initialBookings,
  initialQueueEntries,
} from "../data/mockClinicData"

interface QueueStoreContextType {
  clinic: ClinicInfo
  bookings: Booking[]
  queue: QueueEntry[]
  nowServing: number | null
  currentPatientInChair: QueueEntry | null
  nextUpPatient: QueueEntry | null
  upcomingPatients: QueueEntry[]
  counts: {
    waiting: number
    inChair: number
    completedToday: number
    pendingRequests: number
    lateCount: number
    totalToday: number
  }
  callNext: () => { success: boolean; message: string; patient?: QueueEntry }
  startConsultation: (ticketNumber: number) => { success: boolean; message: string }
  finishConsultation: (ticketNumber: number) => { success: boolean; message: string }
  checkInPatient: (ticketNumber: number) => { success: boolean; message: string }
  markLate: (ticketNumber: number) => { success: boolean; message: string }
  markNoShow: (ticketNumber: number) => { success: boolean; message: string }
  approveBooking: (reference: string) => { success: boolean; message: string }
  rejectBooking: (reference: string) => { success: boolean; message: string }
  addWalkin: (
    name: string,
    phone: string,
    service: VisitType,
  ) => { success: boolean; message: string; ticketNumber: number }
  addOnlineBooking: (
    name: string,
    phone: string,
    service: VisitType,
    note?: string,
  ) => { booking: Booking; ticketNumber: number }
  cancelBooking: (reference: string) => { success: boolean; message: string }
  resetDemoData: () => void
}

const STORAGE_KEY_QUEUE = "luma_dental_queue_v1"
const STORAGE_KEY_BOOKINGS = "luma_dental_bookings_v1"

const QueueStoreContext = createContext<QueueStoreContextType | null>(null)

export const QueueStoreProvider = ({ children }: { children: ReactNode }) => {
  const [clinic] = useState<ClinicInfo>(defaultClinicInfo)

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return initialBookings
  })

  const [queue, setQueue] = useState<QueueEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUEUE)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return initialQueueEntries
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue))
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings))
    } catch {
      // ignore
    }
  }, [queue, bookings])

  // Derive current patient in chair
  const currentPatientInChair = useMemo(() => {
    return queue.find((p) => p.status === "in_progress") || null
  }, [queue])

  // Derive currently active number (either in chair or called)
  const nowServing = useMemo(() => {
    if (currentPatientInChair) return currentPatientInChair.ticketNumber
    const called = queue.find((p) => p.status === "called")
    return called ? called.ticketNumber : null
  }, [queue, currentPatientInChair])

  // Derive next up patient
  const nextUpPatient = useMemo(() => {
    // 1. If someone is called, they are next or entering
    const called = queue.find((p) => p.status === "called")
    if (called && currentPatientInChair) return called

    // 2. Otherwise find first checked_in patient
    return queue.find((p) => p.status === "checked_in") || null
  }, [queue, currentPatientInChair])

  // Derive upcoming patients
  const upcomingPatients = useMemo(() => {
    return queue.filter(
      (p) =>
        p.status === "checked_in" &&
        p.ticketNumber !== nextUpPatient?.ticketNumber,
    )
  }, [queue, nextUpPatient])

  // Counts for reception stats
  const counts = useMemo(
    () => ({
      waiting: queue.filter((p) => ["checked_in", "called"].includes(p.status)).length,
      inChair: queue.filter((p) => p.status === "in_progress").length,
      completedToday: queue.filter((p) => p.status === "finished").length,
      pendingRequests: bookings.filter((b) => b.status === "pending").length,
      lateCount: queue.filter((p) => p.status === "late").length,
      totalToday: queue.length,
    }),
    [queue, bookings],
  )

  // 1. RULE: Call Next Patient
  const callNext = useCallback(() => {
    // Rule 1: No active consultation
    if (queue.some((p) => p.status === "in_progress")) {
      return {
        success: false,
        message: "لا يمكن استدعاء مريض جديد قبل إنهاء الكشف الحالي داخل العيادة.",
      }
    }

    // Rule 2: Cannot call if another patient is already called and in grace period
    const existingCalled = queue.find((p) => p.status === "called")
    if (existingCalled) {
      return {
        success: false,
        message: `المريض #${existingCalled.ticketNumber} (${existingCalled.patientName}) تم استدعاؤه بالفعل وداخل فترة السماح.`,
      }
    }

    // Rule 3: Find next eligible checked-in patient
    const eligible = queue.find((p) => p.status === "checked_in")
    if (!eligible) {
      return {
        success: false,
        message: "لا يوجد مريض حاضر ومستعد للاستدعاء حالياً في صالة الانتظار.",
      }
    }

    const nowStr = new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const graceDate = new Date(Date.now() + 10 * 60 * 1000)
    const graceStr = graceDate.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setQueue((prev) =>
      prev.map((p) =>
        p.ticketNumber === eligible.ticketNumber
          ? {
              ...p,
              status: "called",
              calledAt: nowStr,
              gracePeriodEndsAt: graceStr,
            }
          : p,
      ),
    )

    return {
      success: true,
      message: `تم استدعاء المريض #${eligible.ticketNumber} (${eligible.patientName}) بنجاح. فترة السماح: 10 دقائق.`,
      patient: eligible,
    }
  }, [queue])

  // 2. Start Consultation (Doctor enters chair)
  const startConsultation = useCallback((ticketNumber: number) => {
    const nowStr = new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setQueue((prev) =>
      prev.map((p) =>
        p.ticketNumber === ticketNumber
          ? { ...p, status: "in_progress", consultationStart: nowStr }
          : p,
      ),
    )

    return {
      success: true,
      message: `بدأ كشف المريض #${ticketNumber} في غرفة العلاج.`,
    }
  }, [])

  // 3. Finish Consultation
  const finishConsultation = useCallback((ticketNumber: number) => {
    const nowStr = new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setQueue((prev) =>
      prev.map((p) =>
        p.ticketNumber === ticketNumber
          ? { ...p, status: "finished", consultationEnd: nowStr }
          : p,
      ),
    )

    // Mark related booking completed
    setBookings((prev) =>
      prev.map((b) =>
        b.ticketNumber === ticketNumber ? { ...b, status: "completed" } : b,
      ),
    )

    return {
      success: true,
      message: `تم إنهاء كشف المريض #${ticketNumber} وتسجيل الزيارة بنجاح.`,
    }
  }, [])

  // 4. Check-in (Patient arrives)
  const checkInPatient = useCallback((ticketNumber: number) => {
    const nowStr = new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setQueue((prev) =>
      prev.map((p) =>
        p.ticketNumber === ticketNumber
          ? { ...p, status: "checked_in", checkInTime: nowStr }
          : p,
      ),
    )

    return {
      success: true,
      message: `تم تسجيل وصول المريض #${ticketNumber} وتأكيد استعداده للكشف.`,
    }
  }, [])

  // 5. Mark Late (Exceeded 10 min grace period)
  const markLate = useCallback((ticketNumber: number) => {
    setQueue((prev) =>
      prev.map((p) =>
        p.ticketNumber === ticketNumber ? { ...p, status: "late" } : p,
      ),
    )

    return {
      success: true,
      message: `تم تحويل المريض #${ticketNumber} إلى قائمة الوصول المتأخر مع الحفاظ على مرجع حجزه.`,
    }
  }, [])

  // 6. Mark No-show
  const markNoShow = useCallback((ticketNumber: number) => {
    setQueue((prev) =>
      prev.map((p) =>
        p.ticketNumber === ticketNumber ? { ...p, status: "no_show" } : p,
      ),
    )

    return {
      success: true,
      message: `تم تسجيل المريض #${ticketNumber} كحالة عدم حضور.`,
    }
  }, [])

  // 7. Approve Online Booking
  const approveBooking = useCallback(
    (reference: string) => {
      const target = bookings.find((b) => b.reference === reference)
      if (!target) return { success: false, message: "الطلب غير موجود." }

      const nextTicket =
        queue.length > 0 ? Math.max(...queue.map((p) => p.ticketNumber)) + 1 : 124

      setBookings((prev) =>
        prev.map((b) =>
          b.reference === reference
            ? { ...b, status: "confirmed", ticketNumber: nextTicket }
            : b,
        ),
      )

      const newEntry: QueueEntry = {
        ticketNumber: nextTicket,
        bookingReference: reference,
        patientName: target.patientName,
        phone: target.phone,
        service: target.service,
        source: "online",
        status: "not_arrived",
        estimatedWaitMinutes: (queue.filter((q) => q.status === "checked_in").length + 1) * 15,
      }

      setQueue((prev) => [...prev, newEntry])

      return {
        success: true,
        message: `تمت الموافقة على طلب ${target.patientName} وتخصيص الدور #${nextTicket}.`,
      }
    },
    [bookings, queue],
  )

  // 8. Reject Booking
  const rejectBooking = useCallback((reference: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.reference === reference ? { ...b, status: "rejected" } : b)),
    )
    return {
      success: true,
      message: "تم رفض طلب الحجز وإشعار النظام.",
    }
  }, [])

  // 9. Add Walk-in Patient (Instant arrival in waiting room)
  const addWalkin = useCallback(
    (name: string, phone: string, service: VisitType) => {
      const nextTicket =
        queue.length > 0 ? Math.max(...queue.map((p) => p.ticketNumber)) + 1 : 124
      const reference = `LUMA-W${nextTicket}`
      const nowStr = new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      })

      const newBooking: Booking = {
        reference,
        patientName: name,
        phone: phone || "حضور مباشر",
        service,
        status: "confirmed",
        source: "walk_in",
        createdAt: nowStr,
        ticketNumber: nextTicket,
      }

      const newEntry: QueueEntry = {
        ticketNumber: nextTicket,
        bookingReference: reference,
        patientName: name,
        phone: phone || "—",
        service,
        source: "walk_in",
        status: "checked_in",
        checkInTime: nowStr,
        estimatedWaitMinutes:
          (queue.filter((q) => q.status === "checked_in").length + 1) * 15,
      }

      setBookings((prev) => [...prev, newBooking])
      setQueue((prev) => [...prev, newEntry])

      return {
        success: true,
        message: `تم تسجيل المريض ${name} حضورياً بالدور #${nextTicket} بنجاح.`,
        ticketNumber: nextTicket,
      }
    },
    [queue],
  )

  // 10. Add Online Booking from patient portal
  const addOnlineBooking = useCallback(
    (name: string, phone: string, service: VisitType, note?: string) => {
      const randomRef = `LUMA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      const nextTicket =
        queue.length > 0 ? Math.max(...queue.map((p) => p.ticketNumber)) + 1 : 124
      const nowStr = new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      })

      const newBooking: Booking = {
        reference: randomRef,
        patientName: name,
        phone,
        service,
        note,
        status: "pending",
        source: "online",
        createdAt: nowStr,
        ticketNumber: nextTicket,
      }

      setBookings((prev) => [...prev, newBooking])

      return { booking: newBooking, ticketNumber: nextTicket }
    },
    [queue],
  )

  // 11. Cancel Booking
  const cancelBooking = useCallback((reference: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.reference === reference ? { ...b, status: "cancelled" } : b)),
    )
    setQueue((prev) => prev.filter((q) => q.bookingReference !== reference))
    return {
      success: true,
      message: "تم إلغاء الحجز وتحديث الطابور.",
    }
  }, [])

  // 12. Reset to Initial Demo Data
  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_QUEUE)
    localStorage.removeItem(STORAGE_KEY_BOOKINGS)
    setQueue(initialQueueEntries)
    setBookings(initialBookings)
  }, [])

  return (
    <QueueStoreContext.Provider
      value={{
        clinic,
        bookings,
        queue,
        nowServing,
        currentPatientInChair,
        nextUpPatient,
        upcomingPatients,
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
        addOnlineBooking,
        cancelBooking,
        resetDemoData,
      }}
    >
      {children}
    </QueueStoreContext.Provider>
  )
}

export const useQueueStore = () => {
  const context = useContext(QueueStoreContext)
  if (!context) {
    throw new Error("useQueueStore must be used within a QueueStoreProvider")
  }
  return context
}
