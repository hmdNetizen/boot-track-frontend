import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, User, Calendar, Save, Users } from "lucide-react";
import { mockAttendees, mockAssignmentGrades } from "../data/mockData";
import { useGetSingleBootcamp } from "../hooks/use-get-single-bootcamp";
import { useFetchAttendees } from "../hooks/use-fetch-attendees";
import { Contract } from "starknet";
import { abi } from "../lib/abi";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { provider } from "../lib/rpc-provider";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import toast from "react-hot-toast";
import classNames from "classnames";
import BootcampNotFound from "../components/shared/bootcamp-not-found";
import LoadingSpinner from "../components/shared/loading-spinner";

const AssignmentGrading: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [gradingMode, setGradingMode] = useState<"individual" | "batch">(
    "individual"
  );

  const contractInstance = new Contract(abi, CONTRACT_ADDRESS, provider);

  const { isConnected, address } = useAccount();

  const { sendAsync, isPending } = useSendTransaction({
    calls: undefined,
  });

  const { bootcamp, isLoading } = useGetSingleBootcamp(Number(id));
  const { attendeesList, isLoading: isLoadingAttendees } =
    useFetchAttendees(id);

  if (isLoading || isLoadingAttendees) {
    return <LoadingSpinner />;
  }

  if (!bootcamp) {
    return <BootcampNotFound />;
  }

  const weeks = Array.from({ length: bootcamp.totalWeeks }, (_, i) => i + 1);

  const handleGradeChange = (attendee: string, score: number) => {
    setGrades((prev) => ({
      ...prev,
      [attendee]: score,
    }));
  };

  const getExistingGrade = (attendee: string) => {
    const gradeKey = `${id}-${selectedWeek}-${attendee}`;
    return mockAssignmentGrades[gradeKey]?.score || 0;
  };

  const hasUnsavedChanges = Object.keys(grades).length > 0;

  const onSubmitHandler = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    const attendeeAddresses = Object.keys(grades);
    const scores = attendeeAddresses.map((addr) => grades[addr]);

    try {
      const call = await contractInstance.populate("batch_grade_assignments", {
        bootcamp_id: Number(id),
        week: selectedWeek,
        attendees: attendeeAddresses,
        scores: scores,
      });
      await sendAsync([call]);
      setGrades({});
      toast.success(`Week ${selectedWeek} Assignments graded`);
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while adding tutor");
    }
  };

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
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200">
            Assignment Grading
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            {bootcamp.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGradingMode("individual")}
            className={classNames(
              "px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-500",
              {
                "bg-primary-100 text-primary-700 dark:text-primary-700":
                  gradingMode === "individual",
              }
            )}
          >
            <User className="h-4 w-4 inline mr-1" />
            Individual
          </button>
          <button
            onClick={() => setGradingMode("batch")}
            className={classNames(
              "px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-500",
              {
                "bg-primary-100 text-primary-700 dark:text-primary-700":
                  gradingMode === "batch",
              }
            )}
          >
            <Users className="h-4 w-4 inline mr-1" />
            Batch
          </button>
        </div>
      </div>

      {/* Week Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
        <div className="flex items-center gap-4">
          <Calendar className="h-6 w-6 text-primary-600" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
              Select Week to Grade
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="input-field max-w-xs"
            >
              {weeks.map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Maximum Score
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-300">
              {bootcamp.assignmentMaxScore}
            </p>
          </div>
        </div>
      </div>

      {/* Grading Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-600">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between dark:border-gray-600">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-200">
              Week {selectedWeek} Assignments
            </h2>
          </div>
          {hasUnsavedChanges && (
            <button
              onClick={onSubmitHandler}
              disabled={isPending}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save Grades"}
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {attendeesList.map((attendee, index) => {
            const existingGrade = getExistingGrade(attendee.address);
            const currentGrade = grades[attendee.address] ?? existingGrade;

            return (
              <div key={attendee.address} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-slate-200">
                      {attendee.address.slice(0, 6)}...
                      {attendee.address.slice(-4)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {existingGrade > 0
                        ? `Previous score: ${existingGrade}`
                        : "Not graded yet"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        Score:
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={bootcamp.assignmentMaxScore}
                        value={currentGrade ? currentGrade : ""}
                        onChange={(e) =>
                          handleGradeChange(
                            attendee.address,
                            Number(e.target.value)
                          )
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-500 dark:text-slate-300">
                        / {bootcamp.assignmentMaxScore}
                      </span>
                    </div>

                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300 overflow-x-hidden"
                        style={{
                          width: `${
                            (currentGrade * 100) / bootcamp.assignmentMaxScore
                          }%`,
                          maxWidth: "100%",
                        }}
                      />
                    </div>

                    <div className="text-right min-w-[60px]">
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-300">
                        {Math.round(
                          (currentGrade / bootcamp.assignmentMaxScore) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {gradingMode === "batch" && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-400">
                  Apply same score to all:
                </label>
                <input
                  type="number"
                  // min="0"
                  max={bootcamp.assignmentMaxScore}
                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={(e) => {
                    const score = Number(e.target.value);
                    const batchGrades: Record<string, number> = {};
                    mockAttendees.forEach((attendee) => {
                      batchGrades[attendee] = score;
                    });
                    setGrades(batchGrades);
                  }}
                />
                <span className="text-sm text-gray-500">
                  / {bootcamp.assignmentMaxScore}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 shadow-lg">
            <p className="text-sm text-warning-800 mb-2">
              You have unsaved changes
            </p>
            <button
              onClick={onSubmitHandler}
              disabled={isPending}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AssignmentGrading;
