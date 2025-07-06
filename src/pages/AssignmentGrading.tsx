import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Save,
  Users,
  Loader2,
} from "lucide-react";
import { mockAttendees, mockAssignmentGrades } from "../data/mockData";
import { type SingleBootcamp } from "./BootcampDetails";
import { useAccount, useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { provider } from "../lib/rpc-provider";
import { abi } from "../lib/abi";

const AssignmentGrading: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [gradingMode, setGradingMode] = useState<"individual" | "batch">(
    "individual"
  );

  const { address } = useAccount();
  const { contract } = useContract({
    abi,
    address: CONTRACT_ADDRESS,
    provider,
  });

  const [bootcamp, setBootcamp] = useState<SingleBootcamp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>("");

  // useEffect(() => {
  //   const fetchAssignmentInfo = async () => {
  //     if (!contract) return;

  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const result = await contract.get_assignment_info(Number(id), Number(selectedWeek));
  //       const item = result as BootcampTuple;
  //       const bootcampData: SingleBootcamp = {
  //         id: Number(id),
  //         name: item[0],
  //         totalWeeks: Number(item[1]),
  //         sessionsPerWeek: Number(item[2]),
  //         assignmentMaxScore: Number(item[3]),
  //         numOfAttendees: Number(item[4]),
  //         isActive: item[5],
  //       };
  //       setBootcamp(bootcampData);
  //     } catch (err) {
  //       console.error("Contract call error:", err);
  //       setError(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchAssignmentInfo();
  // }, [contract, address]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="animate-spin size-11" />
      </div>
    );
  }

  if (!bootcamp) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Bootcamp not found</h2>
        <Link to="/" className="btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const weeks = Array.from({ length: bootcamp.totalWeeks }, (_, i) => i + 1);

  const handleGradeChange = (attendee: string, score: number) => {
    setGrades((prev) => ({
      ...prev,
      [attendee]: score,
    }));
  };

  const handleSaveGrades = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Saving grades:", { bootcamp: id, week: selectedWeek, grades });
    setGrades({});
    setIsSaving(false);
  };

  const getExistingGrade = (attendee: string) => {
    const gradeKey = `${id}-${selectedWeek}-${attendee}`;
    return mockAssignmentGrades[gradeKey]?.score || 0;
  };

  const hasUnsavedChanges = Object.keys(grades).length > 0;

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
          <h1 className="text-3xl font-bold text-gray-900">
            Assignment Grading
          </h1>
          <p className="mt-2 text-gray-600">{bootcamp.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGradingMode("individual")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              gradingMode === "individual"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <User className="h-4 w-4 inline mr-1" />
            Individual
          </button>
          <button
            onClick={() => setGradingMode("batch")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              gradingMode === "batch"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Users className="h-4 w-4 inline mr-1" />
            Batch
          </button>
        </div>
      </div>

      {/* Week Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <Calendar className="h-6 w-6 text-primary-600" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <p className="text-sm text-gray-600">Maximum Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {bootcamp.assignmentMaxScore}
            </p>
          </div>
        </div>
      </div>

      {/* Grading Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Week {selectedWeek} Assignments
            </h2>
          </div>
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveGrades}
              disabled={isSaving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Grades"}
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {mockAttendees.map((attendee, index) => {
            const existingGrade = getExistingGrade(attendee);
            const currentGrade = grades[attendee] ?? existingGrade;

            return (
              <div key={attendee} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {attendee.slice(0, 6)}...{attendee.slice(-4)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {existingGrade > 0
                        ? `Previous score: ${existingGrade}`
                        : "Not graded yet"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Score:
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={bootcamp.assignmentMaxScore}
                        value={currentGrade}
                        onChange={(e) =>
                          handleGradeChange(attendee, Number(e.target.value))
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-500">
                        / {bootcamp.assignmentMaxScore}
                      </span>
                    </div>

                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (currentGrade * 100) / bootcamp.assignmentMaxScore
                          }%`,
                        }}
                      />
                    </div>

                    <div className="text-right min-w-[60px]">
                      <span className="text-sm font-medium text-gray-900">
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
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Apply same score to all:
                </label>
                <input
                  type="number"
                  min="0"
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

      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 shadow-lg">
            <p className="text-sm text-warning-800 mb-2">
              You have unsaved changes
            </p>
            <button
              onClick={handleSaveGrades}
              disabled={isSaving}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentGrading;
