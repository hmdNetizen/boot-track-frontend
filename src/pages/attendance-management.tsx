import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Play,
  Square,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { mockAttendanceSessions } from "../data/mockData";
import type { BootcampTuple, SingleBootcamp } from "./bootcamp-details";
import { useAccount, useContract } from "@starknet-react/core";
import { abi } from "../lib/abi";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { provider } from "../lib/rpc-provider";

const AttendanceManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedSession, setSelectedSession] = useState(1);
  const [duration, setDuration] = useState(60);
  const [isOpening, setIsOpening] = useState(false);

  const { address } = useAccount();
  const { contract } = useContract({
    abi,
    address: CONTRACT_ADDRESS,
    provider,
  });

  const [bootcamp, setBootcamp] = useState<SingleBootcamp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>("");

  useEffect(() => {
    const fetchBootcamp = async () => {
      if (!contract) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await contract.get_bootcamp_info(Number(id));
        const item = result as BootcampTuple;
        const bootcampData: SingleBootcamp = {
          id: Number(id),
          name: item[0],
          totalWeeks: Number(item[1]),
          sessionsPerWeek: Number(item[2]),
          assignmentMaxScore: Number(item[3]),
          numOfAttendees: Number(item[4]),
          isActive: item[5],
        };
        setBootcamp(bootcampData);
      } catch (err: any) {
        console.error("Contract call error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBootcamp();
  }, [contract, address]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="animate-spin size-11" />
      </div>
    );
  }

  if (!bootcamp?.name) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Bootcamp not found</h2>
        <Link to="/" className="btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleOpenAttendance = async () => {
    setIsOpening(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Opening attendance for:", {
      bootcamp: id,
      week: selectedWeek,
      session: selectedSession,
      duration,
    });
    setIsOpening(false);
  };

  const handleCloseAttendance = async (week: number, session: number) => {
    console.log("Closing attendance for:", { bootcamp: id, week, session });
  };

  const getSessionKey = (week: number, session: number) =>
    `${id}-${week}-${session}`;
  const getSessionStatus = (week: number, session: number) => {
    const sessionData = mockAttendanceSessions[getSessionKey(week, session)];
    if (!sessionData) return "not-started";
    if (sessionData.isOpen) {
      const now = Date.now();
      const endTime =
        sessionData.openedAt + sessionData.durationMinutes * 60 * 1000;
      return now <= endTime ? "open" : "expired";
    }
    return "closed";
  };

  const weeks = Array.from({ length: bootcamp.totalWeeks }, (_, i) => i + 1);
  const sessions = Array.from(
    { length: bootcamp.sessionsPerWeek },
    (_, i) => i + 1
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/bootcamp/${id}`}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="mt-2 text-gray-600">{bootcamp.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Open New Session */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Play className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Open Attendance
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week
                </label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="input-field"
                >
                  {weeks.map((week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(Number(e.target.value))}
                  className="input-field"
                >
                  {sessions.map((session) => (
                    <option key={session} value={session}>
                      Session {session}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input-field"
                  min="5"
                  max="300"
                />
              </div>

              <button
                onClick={handleOpenAttendance}
                disabled={
                  isOpening ||
                  getSessionStatus(selectedWeek, selectedSession) === "open"
                }
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOpening ? "Opening..." : "Open Attendance"}
              </button>

              {getSessionStatus(selectedWeek, selectedSession) === "open" && (
                <div className="p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700">
                    Attendance is already open for this session
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sessions Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Sessions Overview
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {weeks.map((week) =>
                  sessions.map((session) => {
                    const status = getSessionStatus(week, session);
                    const sessionData =
                      mockAttendanceSessions[getSessionKey(week, session)];

                    return (
                      <div
                        key={`${week}-${session}`}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">
                            Week {week}, Session {session}
                          </h3>
                          <div className="flex items-center gap-2">
                            {status === "open" && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                                <span className="text-xs text-success-600">
                                  Live
                                </span>
                              </div>
                            )}
                            {status === "open" ? (
                              <CheckCircle className="h-5 w-5 text-success-500" />
                            ) : status === "closed" ? (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            ) : status === "expired" ? (
                              <Clock className="h-5 w-5 text-warning-500" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                        </div>

                        {sessionData && (
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{sessionData.durationMinutes} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {sessionData.totalAttendees} attendees
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(
                                  sessionData.openedAt
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {status === "open" && (
                          <button
                            onClick={() => handleCloseAttendance(week, session)}
                            className="mt-3 w-full btn-secondary text-sm"
                          >
                            Close Session
                          </button>
                        )}

                        {status === "not-started" && (
                          <div className="mt-3 text-center">
                            <span className="text-sm text-gray-500">
                              Not started
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
