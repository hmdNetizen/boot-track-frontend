import {
  Calendar,
  FileText,
  GraduationCap,
  Shield,
  UserCheck,
} from "lucide-react";

export const renderQuickActions = (id: string | undefined) => {
  return [
    {
      name: "Manage Attendees",
      href: `/bootcamp/${id}/attendees`,
      icon: UserCheck,
      description: "Register and manage attendees",
      color: "text-success-600 bg-success-50",
    },
    {
      name: "Manage Tutors",
      href: `/bootcamp/${id}/tutors`,
      icon: Shield,
      description: "Add and manage tutors",
      color: "text-warning-600 bg-warning-50",
    },
    {
      name: "Manage Attendance",
      href: `/bootcamp/${id}/attendance`,
      icon: Calendar,
      description: "Open sessions and track attendance",
      color: "text-primary-600 bg-primary-50",
    },
    {
      name: "Grade Assignments",
      href: `/bootcamp/${id}/assignments`,
      icon: FileText,
      description: "Review and grade student work",
      color: "text-purple-600 bg-purple-50",
    },
    {
      name: "Process Graduation",
      href: `/bootcamp/${id}/graduation`,
      icon: GraduationCap,
      description: "Evaluate graduation status",
      color: "text-error-600 bg-error-50",
    },
  ];
};
