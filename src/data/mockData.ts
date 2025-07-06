import type {
  Bootcamp,
  AttendeeRecord,
  AttendanceSession,
  AssignmentGrade,
} from "../types/index";

export const mockBootcamps: Bootcamp[] = [
  {
    id: "1",
    name: "Web3 Development Bootcamp",
    organizer: "0x1234567890123456789012345678901234567890",
    totalWeeks: 12,
    sessionsPerWeek: 3,
    assignmentMaxScore: 100,
    isActive: true,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "2",
    name: "Smart Contract Security",
    organizer: "0x1234567890123456789012345678901234567890",
    totalWeeks: 8,
    sessionsPerWeek: 2,
    assignmentMaxScore: 50,
    isActive: true,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: "3",
    name: "DeFi Protocol Development",
    organizer: "0x1234567890123456789012345678901234567890",
    totalWeeks: 16,
    sessionsPerWeek: 2,
    assignmentMaxScore: 75,
    isActive: false,
    createdAt: Date.now() - 86400000 * 60,
  },
];

export const mockAttendees = [
  "0xabcdef1234567890123456789012345678901234",
  "0xfedcba0987654321098765432109876543210987",
  "0x1111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222",
  "0x3333333333333333333333333333333333333333",
];

export const mockTutors = [
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
];

export const mockAttendeeRecords: Record<string, AttendeeRecord> = {
  "0xabcdef1234567890123456789012345678901234": {
    isRegistered: true,
    attendanceCount: 28,
    totalAssignmentScore: 850,
    graduationStatus: 3,
  },
  "0xfedcba0987654321098765432109876543210987": {
    isRegistered: true,
    attendanceCount: 24,
    totalAssignmentScore: 720,
    graduationStatus: 2,
  },
  "0x1111111111111111111111111111111111111111": {
    isRegistered: true,
    attendanceCount: 15,
    totalAssignmentScore: 450,
    graduationStatus: 1,
  },
  "0x2222222222222222222222222222222222222222": {
    isRegistered: true,
    attendanceCount: 8,
    totalAssignmentScore: 200,
    graduationStatus: 0,
  },
  "0x3333333333333333333333333333333333333333": {
    isRegistered: true,
    attendanceCount: 32,
    totalAssignmentScore: 920,
    graduationStatus: 3,
  },
};

export const mockAttendanceSessions: Record<string, AttendanceSession> = {
  "1-1-1": {
    isOpen: false,
    openedAt: Date.now() - 86400000,
    durationMinutes: 60,
    totalAttendees: 4,
  },
  "1-1-2": {
    isOpen: true,
    openedAt: Date.now() - 1800000, // 30 minutes ago
    durationMinutes: 90,
    totalAttendees: 3,
  },
  "1-2-1": {
    isOpen: false,
    openedAt: Date.now() - 86400000 * 7,
    durationMinutes: 120,
    totalAttendees: 5,
  },
};

export const mockAssignmentGrades: Record<string, AssignmentGrade> = {
  "1-1-0xabcdef1234567890123456789012345678901234": {
    score: 95,
    gradedBy: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    gradedAt: Date.now() - 86400000 * 2,
  },
  "1-1-0xfedcba0987654321098765432109876543210987": {
    score: 87,
    gradedBy: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    gradedAt: Date.now() - 86400000 * 2,
  },
  "1-2-0xabcdef1234567890123456789012345678901234": {
    score: 92,
    gradedBy: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    gradedAt: Date.now() - 86400000,
  },
};
