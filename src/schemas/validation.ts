import { z } from "zod";

// Create Bootcamp Schema
export const createBootcampSchema = z.object({
  name: z
    .string()
    .min(1, "Bootcamp name is required")
    .min(3, "Bootcamp name must be at least 3 characters")
    .max(100, "Bootcamp name must be less than 100 characters"),
  totalAttendees: z.number().min(1, "Total attendees must be at least 1"),
  totalWeeks: z
    .number()
    .min(1, "Total weeks must be at least 1")
    .max(52, "Total weeks cannot exceed 52"),
  sessionsPerWeek: z
    .number()
    .min(1, "Sessions per week must be at least 1")
    .max(7, "Sessions per week cannot exceed 7"),
  assignmentMaxScore: z
    .number()
    .min(1, "Assignment max score must be at least 1"),
});

export type CreateBootcampFormData = z.infer<typeof createBootcampSchema>;

// Attendance Management Schema
export const openAttendanceSchema = z.object({
  week: z.number().min(1, "Week is required"),
  session: z.number().min(1, "Session is required"),
  duration: z
    .number()
    .min(5, "Duration must be at least 5 minutes")
    .max(300, "Duration cannot exceed 300 minutes"),
});

export type OpenAttendanceFormData = z.infer<typeof openAttendanceSchema>;

// Register Attendees Schema
export const registerAttendeesSchema = z.object({
  attendeeAddresses: z
    .string()
    .min(1, "At least one attendee address is required")
    .refine((value) => {
      const addresses = value.split("\n").filter((addr) => addr.trim());
      return addresses.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim()));
    }, "All addresses must be valid Ethereum addresses (one per line)"),
});

export type RegisterAttendeesFormData = z.infer<typeof registerAttendeesSchema>;

// Add Tutor Schema
export const addTutorSchema = z.object({
  tutorAddress: z
    .string()
    .min(1, "Tutor address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
});

export type AddTutorFormData = z.infer<typeof addTutorSchema>;

// Assignment Grading Schema
export const gradeAssignmentSchema = z.object({
  week: z.number().min(1, "Week is required"),
  attendeeGrades: z
    .record(
      z.string(),
      z
        .number()
        .min(0, "Score cannot be negative")
        .max(1000, "Score cannot exceed maximum allowed")
    )
    .refine(
      (grades) => Object.keys(grades).length > 0,
      "At least one grade must be provided"
    ),
});

export type GradeAssignmentFormData = z.infer<typeof gradeAssignmentSchema>;

// Batch Grading Schema
export const batchGradingSchema = z.object({
  week: z.number().min(1, "Week is required"),
  batchScore: z
    .number()
    .min(0, "Score cannot be negative")
    .max(1000, "Score cannot exceed maximum allowed"),
});

export type BatchGradingFormData = z.infer<typeof batchGradingSchema>;

// Individual Graduation Processing Schema
export const individualGraduationSchema = z.object({
  attendee: z
    .string()
    .min(1, "Attendee selection is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
});

export type IndividualGraduationFormData = z.infer<
  typeof individualGraduationSchema
>;
