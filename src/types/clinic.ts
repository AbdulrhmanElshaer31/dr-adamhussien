export type BookingStatus =
  | "pending"     // بانتظار موافقة السكرتيرة
  | "confirmed"   // تم تأكيد الحجز
  | "rejected"    // تم رفض الطلب
  | "cancelled"   // ملغي من المريض أو العيادة
  | "completed"   // انتهت الزيارة بالكامل

export type QueueStatus =
  | "not_arrived" // المريض لسه موصلش العيادة
  | "checked_in"  // المريض وصل وسجل حضوره في الاستقبال
  | "called"      // تم النداء على المريض - بدء فترة السماح
  | "in_progress" // المريض داخل غرفة الكشف مع الطبيب
  | "late"        // المريض تجاوز فترة السماح (10 دقائق)
  | "no_show"     // تم تسجيل عدم الحضور نهائياً
  | "finished"    // تم إنهاء الكشف الطبي

export type VisitType =
  | "كشف عام واستشارة"
  | "تنظيف وتلميع الأسنان"
  | "علاج الجذور وحشو العصب"
  | "تجميل وعدسات الأسنان"
  | "ألم أسنان / تقييم عاجل"
  | "زراعة وتعويضات الأسنان"

export interface ClinicInfo {
  name: string
  tagline: string
  doctorName: string
  doctorTitle: string
  doctorBio: string
  address: string
  city: string
  phone: string
  workingHours: string
  gracePeriodMinutes: number // الافتراضي: 10 دقائق
  lateArrivalStepDelay: number // عدد المرضى الجاهزين قبل إدراج المتأخر (2)
}

export interface Booking {
  reference: string       // كود مرجعي ثابت مثل: LUMA-8K24
  patientName: string
  phone: string
  service: VisitType
  note?: string
  status: BookingStatus
  source: "online" | "walk_in"
  createdAt: string
  ticketNumber?: number
}

export interface QueueEntry {
  ticketNumber: number
  bookingReference: string
  patientName: string
  phone: string
  service: VisitType
  source: "online" | "walk_in"
  status: QueueStatus
  checkInTime?: string
  calledAt?: string
  gracePeriodEndsAt?: string
  consultationStart?: string
  consultationEnd?: string
  estimatedWaitMinutes?: number
}

export interface ConsultationSession {
  ticketNumber: number
  patientName: string
  service: VisitType
  doctorName: string
  roomName: string
  startTime: string
  status: "active" | "completed"
}
