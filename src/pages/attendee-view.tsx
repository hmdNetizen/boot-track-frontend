import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { mockAttendanceSessions } from "../data/mockData";
import { GraduationStatus, GraduationStatusColors } from "../types";

import { useAccount, useContract } from "@starknet-react/core";
import { abi } from "../lib/abi";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { provider } from "../lib/rpc-provider";
import type { TAttendee } from "../components/attendees";
import { useGetSingleBootcamp } from "../hooks/use-get-single-bootcamp";
import LoadingSpinner from "../components/shared/loading-spinner";
import BootcampNotFound from "../components/shared/bootcamp-not-found";
import classNames from "classnames";

type TAttendeeData = Pick<
  TAttendee,
  "address" | "attendanceCount" | "graduationStatus" | "totalAssignmentScore"
> & { attendanceRate: number };

const AttendeeView: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId: string }>();
  const [searchParams] = useSearchParams();
  const attendeeAddress = searchParams.get("address");
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<null | string>(null);

  const [attendeeInfo, setAttendeeInfo] = useState<TAttendeeData>();

  const { address } = useAccount();
  const { contract } = useContract({
    abi: abi,
    address: CONTRACT_ADDRESS,
    provider,
  });

  const {
    bootcamp,
    isLoading: isLoadingBootcamp,
    error: _bootcampError,
  } = useGetSingleBootcamp(Number(bootcampId));

  useEffect(() => {
    if (attendeeAddress && bootcampId) {
      const fetchAttendeeInfo = async () => {
        if (!contract || !address) return;

        setIsLoading(true);
        setError(null);

        try {
          const result = await contract.get_attendee_stats(
            Number(bootcampId),
            attendeeAddress
          );
          const attendanceCount = Number(result[0]);
          const totalAssignmentScore = Number(result[1]);
          const attendanceRate = Number(result[2]);
          const graduationStatus = Number(result[3]);
          console.log(result);

          setAttendeeInfo({
            address: attendeeAddress!,
            attendanceCount,
            totalAssignmentScore,
            attendanceRate,
            graduationStatus,
          });
        } catch (err: any) {
          console.error("Contract call error:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAttendeeInfo();
    }
  }, [contract, address, bootcampId, attendeeAddress]);

  if (isLoading || isLoadingBootcamp) {
    return <LoadingSpinner />;
  }

  if (!bootcamp || !attendeeAddress || !attendeeInfo) {
    return <BootcampNotFound />;
  }

  const totalSessions = bootcamp.totalWeeks * bootcamp.sessionsPerWeek;
  const maxTotalScore = bootcamp.assignmentMaxScore * bootcamp.totalWeeks;
  // const attendanceRate = Math.round(
  //   (attendeeRecord.attendanceCount / totalSessions) * 100
  // );
  const scorePercentage = Math.round(
    (attendeeInfo.totalAssignmentScore / maxTotalScore) * 100
  );

  // Generate mock attendance data for visualization
  const weeks = Array.from({ length: bootcamp.totalWeeks }, (_, i) => i + 1);
  const sessions = Array.from(
    { length: bootcamp.sessionsPerWeek },
    (_, i) => i + 1
  );

  const getSessionAttendance = (week: number, session: number) => {
    // Mock logic - in real app this would come from contract
    const sessionKey = `${bootcampId}-${week}-${session}`;
    const sessionData = mockAttendanceSessions[sessionKey];
    if (!sessionData) return "not-started";

    // Simulate attendance based on attendee's overall attendance rate
    return Math.random() < attendeeInfo.attendanceRate / 100
      ? "attended"
      : "missed";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/bootcamp/${bootcampId}`}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200">
            Attendee Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            {bootcamp.name}
          </p>
        </div>
      </div>

      {/* Attendee Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-200">
              {attendeeAddress.slice(0, 6)}...{attendeeAddress.slice(-4)}
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              {attendeeAddress}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`status-badge ${
                GraduationStatusColors[
                  attendeeInfo.graduationStatus as keyof typeof GraduationStatusColors
                ]
              }`}
            >
              {
                GraduationStatus[
                  attendeeInfo.graduationStatus as keyof typeof GraduationStatus
                ]
              }
            </span>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-200">
                Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {attendeeInfo.attendanceCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-300">
                of {totalSessions} sessions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-200">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {attendeeInfo.attendanceRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-200">
                Total Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
                {attendeeInfo.totalAssignmentScore}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                of {maxTotalScore} possible
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-error-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-200">
                Score Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-300">
                {scorePercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-200">
            Attendance Progress
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-slate-400">
                Overall Progress
              </span>
              <span className="font-medium dark:text-slate-400">
                {attendeeInfo.attendanceRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${attendeeInfo.attendanceRate}%` }}
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3 dark:text-slate-300">
                Weekly Breakdown
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {weeks.map((week) => (
                  <div key={week} className="text-center">
                    <div className="text-xs text-gray-600 mb-1 dark:text-slate-400">
                      W{week}
                    </div>
                    <div className="flex gap-1 justify-center">
                      {sessions.map((session) => {
                        const status = getSessionAttendance(week, session);
                        return (
                          <div
                            key={session}
                            className={classNames(
                              "w-3 h-3 rounded-full bg-gray-300",
                              {
                                "bg-success-500": status === "attended",
                                "bg-error-500": status === "missed",
                              }
                            )}
                            title={`Week ${week}, Session ${session}: ${status}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-success-500 rounded-full" />
                  <span>Attended</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-error-500 rounded-full" />
                  <span>Missed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span>Not Started</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-200">
            Assignment Progress
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-slate-400">
                Overall Score
              </span>
              {/* <span className="font-medium">{scorePercentage}%</span> */}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-success-600 h-3 rounded-full transition-all duration-500"
                // style={{ width: `${scorePercentage}%` }}
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3 dark:text-slate-300">
                Weekly Scores
              </h4>
              <div className="space-y-2">
                {weeks.slice(0, 8).map((week) => {
                  // Mock weekly scores
                  const weeklyScore = Math.floor(
                    Math.random() * bootcamp.assignmentMaxScore
                  );
                  const weeklyPercentage = Math.round(
                    (weeklyScore / bootcamp.assignmentMaxScore) * 100
                  );

                  return (
                    <div key={week} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-12 dark:text-slate-400">
                        Week {week}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-warning-500 h-2 rounded-full"
                          style={{ width: `${weeklyPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right dark:text-slate-400">
                        {weeklyScore}/{bootcamp.assignmentMaxScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graduation Requirements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-200">
          Graduation Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {attendeeInfo.attendanceRate >= 25 ? (
                <CheckCircle className="h-5 w-5 text-success-500" />
              ) : (
                <XCircle className="h-5 w-5 text-error-500" />
              )}
              <span className="font-medium dark:text-slate-400">
                Minimum Attendance (25%)
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-7 dark:text-slate-300">
              Current: {attendeeInfo.attendanceRate}%{" "}
              {attendeeInfo.attendanceRate >= 25 ? "✓" : "✗"}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {attendeeInfo.attendanceRate >= 50 && scorePercentage >= 50 ? (
                <CheckCircle className="h-5 w-5 text-success-500" />
              ) : (
                <XCircle className="h-5 w-5 text-error-500" />
              )}
              <span className="font-medium dark:text-slate-400">
                Graduate Requirements
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-7 dark:text-slate-300">
              50% attendance + 50% score{" "}
              {attendeeInfo.attendanceRate >= 50 && scorePercentage >= 50
                ? "✓"
                : "✗"}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {attendeeInfo.attendanceRate >= 50 && scorePercentage >= 75 ? (
                <CheckCircle className="h-5 w-5 text-success-500" />
              ) : (
                <XCircle className="h-5 w-5 text-error-500" />
              )}
              <span className="font-medium dark:text-slate-400">
                Distinction Requirements
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-7 dark:text-slate-300">
              50% attendance + 80% score{" "}
              {attendeeInfo.attendanceRate >= 50 && scorePercentage >= 80
                ? "✓"
                : "✗"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeView;
