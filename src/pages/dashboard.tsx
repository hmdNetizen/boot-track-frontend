import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";
import type { BootcampData } from "../App";
import BootcampItem from "../components/bootcamp-item";

type DashboardProps = {
  bootcamps: Array<BootcampData>;
  isLoading: boolean;
};

const Dashboard = (props: DashboardProps) => {
  const { bootcamps, isLoading } = props;
  const activeBootcamps = bootcamps.filter((b) => b.isActive);
  const totalBootcamps = bootcamps.length;
  const totalSessions = bootcamps.reduce((sum, bootcamp) => {
    return sum + bootcamp.totalWeeks * bootcamp.sessionsPerWeek;
  }, 0);
  const totalAttendees = bootcamps.reduce(
    (sum, bootcamp) => sum + bootcamp.numOfAttendees,
    0
  );

  const stats = [
    {
      name: "Total Bootcamps",
      value: totalBootcamps,
      icon: BookOpen,
      color: "text-primary-600",
    },
    {
      name: "Active Bootcamps",
      value: activeBootcamps.length,
      icon: TrendingUp,
      color: "text-success-600",
    },
    {
      name: "Total Attendees",
      value: totalAttendees,
      icon: Users,
      color: "text-warning-600",
    },
    {
      name: "Total Sessions",
      value: totalSessions,
      icon: Calendar,
      color: "text-error-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            Manage your bootcamps and track progress
          </p>
        </div>
        <Link
          to="/create-bootcamp"
          className="btn-primary flex items-center gap-2 border-2 border-primary-700 dark:border-gray-400"
        >
          <Plus className="h-5 w-5" />
          Create Bootcamp
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bootcamps List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-600">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-200">
            Your Bootcamps
          </h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-16">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : bootcamps.length === 0 ? (
          <div className="flex min-h-16 justify-center items-center">
            <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
              There are currently no bootcamp associated with this account
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {bootcamps.map((bootcamp) => (
              <BootcampItem key={bootcamp.id} bootcamp={bootcamp} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
