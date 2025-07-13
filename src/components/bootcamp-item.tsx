import type { BootcampData } from "../App";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

type BootcampItemProp = {
  bootcamp: BootcampData;
};

export default function BootcampItem({ bootcamp }: BootcampItemProp) {
  const {
    id,
    name,
    totalWeeks,
    sessionsPerWeek,
    isActive,
    createdAt,
    assignmentMaxScore,
  } = bootcamp;
  return (
    <li className="p-6 hover:bg-gray-50 transition-colors dark:hover:bg-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-300">
              {name}
            </h3>
            <span
              className={`status-badge ${
                isActive ? "status-active" : "status-inactive"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-6 text-sm text-gray-600 dark:text-slate-400">
            <span>{totalWeeks} weeks</span>
            <span>{sessionsPerWeek} sessions/week</span>
            <span>Max score: {assignmentMaxScore}</span>
            <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/bootcamp/${id}`}
            className="btn-secondary flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
        </div>
      </div>
    </li>
  );
}
