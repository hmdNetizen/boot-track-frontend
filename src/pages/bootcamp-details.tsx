import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Calendar,
  GraduationCap,
  Settings,
  Clock,
} from "lucide-react";

import type { BootcampData } from "../App";
export type BootcampTuple = [string, bigint, bigint, bigint, bigint, boolean];
import Attendees from "../components/attendees";
import { useGetSingleBootcamp } from "../hooks/use-get-single-bootcamp";
import LoadingSpinner from "../components/shared/loading-spinner";
import BootcampNotFound from "../components/shared/bootcamp-not-found";
import { renderQuickActions } from "../constants/quick-actions";

export type SingleBootcamp = Pick<
  BootcampData,
  | "name"
  | "numOfAttendees"
  | "sessionsPerWeek"
  | "totalWeeks"
  | "assignmentMaxScore"
  | "isActive"
  | "id"
>;

const BootcampDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { bootcamp, isLoading } = useGetSingleBootcamp(Number(id));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!bootcamp) {
    return <BootcampNotFound />;
  }

  const totalSessions = bootcamp.totalWeeks * bootcamp.sessionsPerWeek;

  const quickActions = renderQuickActions(id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200">
              {bootcamp.name}
            </h1>
            <span
              className={`status-badge ${
                bootcamp.isActive ? "status-active" : "status-inactive"
              }`}
            >
              {bootcamp.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            {/* Created on {new Date(bootcamp.createdAt).toLocaleDateString()} */}
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Duration
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {bootcamp.totalWeeks} weeks
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Total Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Attendees
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {bootcamp.numOfAttendees}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-error-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Max Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {bootcamp.assignmentMaxScore}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-300">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors card-hover dark:border-gray-600 dark:shadow-gray-700"
              >
                <div
                  className={`inline-flex p-2 rounded-lg ${action.color} mb-3`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-slate-200">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Attendees List */}
      <Attendees totalSessions={totalSessions} id={bootcamp.id} />
    </div>
  );
};

export default BootcampDetails;
