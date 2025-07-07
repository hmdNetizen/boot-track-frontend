import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  Loader2,
} from "lucide-react";
import type { BootcampData } from "../App";

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your bootcamps and track progress
          </p>
        </div>
        <Link
          to="/create-bootcamp"
          className="btn-primary flex items-center gap-2 border-2 border-primary-700"
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bootcamps List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Bootcamps
          </h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-16">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : bootcamps.length === 0 ? (
          <div className="flex min-h-16 justify-center items-center">
            <p className="text-sm font-medium text-gray-600">
              There are currently no bootcamp associated with this account
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bootcamps.map((bootcamp) => (
              <div
                key={bootcamp.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {bootcamp.name}
                      </h3>
                      <span
                        className={`status-badge ${
                          bootcamp.isActive
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {bootcamp.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
                      <span>{bootcamp.totalWeeks} weeks</span>
                      <span>{bootcamp.sessionsPerWeek} sessions/week</span>
                      <span>Max score: {bootcamp.assignmentMaxScore}</span>
                      <span>
                        Created:{" "}
                        {new Date(bootcamp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/bootcamp/${bootcamp.id}`}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
