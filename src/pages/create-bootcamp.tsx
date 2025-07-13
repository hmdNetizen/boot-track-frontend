import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Contract } from "starknet";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { useForm } from "react-hook-form";

import { abi } from "../lib/abi";
import {
  type CreateBootcampFormData,
  createBootcampSchema,
} from "../schemas/validation";
import FormField from "../components/shared/form-field";
import { provider } from "../lib/rpc-provider";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import type { BootcampData } from "../App";
import classNames from "classnames";

type Props = {
  setBootcamps: React.Dispatch<React.SetStateAction<Array<BootcampData>>>;
};

const CreateBootcamp = ({ setBootcamps }: Props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBootcampFormData>({
    resolver: zodResolver(createBootcampSchema),
    defaultValues: {
      name: "",
      totalAttendees: 20,
      totalWeeks: 8,
      sessionsPerWeek: 2,
      assignmentMaxScore: 10,
    },
  });

  const watchedValues = watch();

  const totalSessions =
    watchedValues.totalWeeks * watchedValues.sessionsPerWeek;
  const maxPossibleScore =
    watchedValues.assignmentMaxScore * watchedValues.totalWeeks;

  const contractInstance = new Contract(abi, CONTRACT_ADDRESS, provider);

  const { isConnected, address } = useAccount();

  const { sendAsync, isPending } = useSendTransaction({
    calls: undefined,
  });

  const onCreateBootCampHandler = async (data: CreateBootcampFormData) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const call = contractInstance.populate("create_bootcamp", {
        name: data.name,
        num_of_attendees: data.totalAttendees,
        total_weeks: data.totalWeeks,
        sessions_per_week: data.sessionsPerWeek,
        assignment_max_score: data.assignmentMaxScore,
      });

      const result = await sendAsync([call]);
      toast.success("Bootcamp successfully created");
      console.log("Transaction hash:", result.transaction_hash);
      setBootcamps((prev) => [
        ...prev,
        {
          createdAt: new Date(),
          id: prev.length + 1,
          isActive: true,
          assignmentMaxScore: data.assignmentMaxScore,
          name: data.name,
          numOfAttendees: data.totalAttendees,
          organizer: address,
          sessionsPerWeek: data.sessionsPerWeek,
          totalWeeks: data.totalWeeks,
        },
      ]);
      navigate("/");
      reset();
    } catch (error: any) {
      console.log("Transaction error:", error);

      const errorMessage = error.message?.toLowerCase() || "";
      const errorName = error.name?.toLowerCase() || "";

      if (
        errorName.includes("userrejected") ||
        errorMessage.includes("user rejected") ||
        errorMessage.includes("cancelled") ||
        errorMessage.includes("denied")
      ) {
        // User cancelled - this is normal, show a gentle message
        toast.error("Transaction was cancelled");
      } else if (
        errorMessage.includes("insufficient funds") ||
        errorMessage.includes("insufficient balance")
      ) {
        toast.error("Insufficient funds to complete transaction");
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("connection")
      ) {
        toast.error(
          "Network error. Please check your connection and try again"
        );
      } else if (errorMessage.includes("nonce")) {
        toast.error("Transaction nonce error. Please try again");
      } else {
        toast.error("Transaction failed. Please try again");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200">
            Create New Bootcamp
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-500">
            Set up a new bootcamp with custom data
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 dark:bg-gray-800 dark:border-gray-600">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-200">
            Bootcamp Details
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onCreateBootCampHandler)}
          className="space-y-6"
        >
          <FormField label="Bootcamp Name" error={errors.name} required>
            <input
              {...register("name")}
              type="text"
              className={classNames("input-field", {
                "border-error-300 focus:ring-error-500": errors.name,
              })}
              placeholder="e.g., Web3 Development Bootcamp"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Number of Attendees"
              error={errors.totalAttendees}
              required
            >
              <input
                {...register("totalAttendees", { valueAsNumber: true })}
                type="number"
                min="1"
                max="1000"
                className={`input-field ${
                  errors.totalAttendees
                    ? "border-error-300 focus:ring-error-500"
                    : ""
                }`}
              />
            </FormField>

            <FormField label="Total Weeks" error={errors.totalWeeks} required>
              <input
                {...register("totalWeeks", { valueAsNumber: true })}
                type="number"
                min="1"
                max="52"
                className={`input-field ${
                  errors.totalWeeks
                    ? "border-error-300 focus:ring-error-500"
                    : ""
                }`}
              />
            </FormField>

            <FormField
              label="Sessions per Week"
              error={errors.sessionsPerWeek}
              required
            >
              <input
                {...register("sessionsPerWeek", { valueAsNumber: true })}
                type="number"
                min="1"
                max="7"
                className={`input-field ${
                  errors.sessionsPerWeek
                    ? "border-error-300 focus:ring-error-500"
                    : ""
                }`}
              />
            </FormField>

            <FormField
              label="Max Assignment Score"
              error={errors.assignmentMaxScore}
              required
            >
              <input
                {...register("assignmentMaxScore", { valueAsNumber: true })}
                type="number"
                min="1"
                max="1000"
                className={`input-field ${
                  errors.assignmentMaxScore
                    ? "border-error-300 focus:ring-error-500"
                    : ""
                }`}
              />
            </FormField>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
            <h3 className="text-sm font-medium text-gray-900 mb-2 dark:text-slate-300">
              Bootcamp Summary
            </h3>
            <div className="text-sm text-gray-600 space-y-1 dark:text-slate-400">
              <p>• Total Number of Attendees: {watchedValues.totalAttendees}</p>
              <p>• Total sessions: {totalSessions}</p>
              <p>• Duration: {watchedValues.totalWeeks} weeks</p>
              <p>
                • Weekly commitment: {watchedValues.sessionsPerWeek} sessions
              </p>
              <p>• Maximum possible score: {maxPossibleScore}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-secondary flex-1 dark:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="btn-primary flex flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-500"
            >
              {isSubmitting || isPending ? (
                <Loader2 className="animate-spin anim" />
              ) : (
                "Create Bootcamp"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBootcamp;
