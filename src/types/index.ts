export interface Bootcamp {
  id: string
  name: string
  organizer: string
  totalWeeks: number
  sessionsPerWeek: number
  assignmentMaxScore: number
  isActive: boolean
  createdAt: number
}

export interface AttendeeRecord {
  isRegistered: boolean
  attendanceCount: number
  totalAssignmentScore: number
  graduationStatus: number // 0: None, 1: Attendee, 2: Graduate, 3: Distinction
}

export interface AttendanceSession {
  isOpen: boolean
  openedAt: number
  durationMinutes: number
  totalAttendees: number
}

export interface AssignmentGrade {
  score: number
  gradedBy: string
  gradedAt: number
}

export interface AttendeeStats {
  attendanceCount: number
  totalAssignmentScore: number
  attendanceRate: number
  graduationStatus: number
}

export const GraduationStatus = {
  0: 'None',
  1: 'Attendee',
  2: 'Graduate',
  3: 'Distinction'
} as const

export const GraduationStatusColors = {
  0: 'graduation-none',
  1: 'graduation-attendee', 
  2: 'graduation-graduate',
  3: 'graduation-distinction'
} as const