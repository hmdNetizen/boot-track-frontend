import type { TAttendee } from "./attendees";
import { GraduationStatus, GraduationStatusColors } from "../types";
import { Link } from "react-router-dom";

type AttendeeItemProps = {
  attendee: TAttendee;
  index: number;
  totalSessions: number;
  bootcampId: number;
};

export default function AttendeeItem({
  attendee,
  index,
  totalSessions,
  bootcampId,
}: AttendeeItemProps) {
  const attendanceRate = Math.round(
    (attendee.attendanceCount / totalSessions) * 100
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center dark:bg-gray-600">
              <span className="text-primary-600 font-medium dark:text-slate-200">
                {index + 1}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-slate-300">
                {attendee.address.slice(0, 6)}...{attendee.address.slice(-4)}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Attendance: {attendee.attendanceCount}/{totalSessions} (
                {attendanceRate}%)
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-slate-400">
              Score: {attendee.totalAssignmentScore}
            </p>
            <span
              className={`status-badge ${
                GraduationStatusColors[
                  attendee.graduationStatus as keyof typeof GraduationStatusColors
                ]
              }`}
            >
              {
                GraduationStatus[
                  attendee.graduationStatus as keyof typeof GraduationStatus
                ]
              }
            </span>
          </div>
          <Link
            to={`/attendee/${bootcampId}?address=${attendee.address}`}
            className="btn-secondary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
