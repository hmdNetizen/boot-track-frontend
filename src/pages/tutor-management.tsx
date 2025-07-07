import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  UserPlus,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

import { useDynamicInputs, type InputField } from "../hooks/use-dynamic-input";
import { useGetSingleBootcamp } from "../hooks/use-get-single-bootcamp";
import { Contract } from "starknet";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { abi } from "../lib/abi";
import { provider } from "../lib/rpc-provider";
import toast from "react-hot-toast";
import { useFetchTutors } from "../hooks/use-fetch-tutors";

const TutorManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [fields, setFields] = useState<InputField[]>([
    { id: "1", value: "", isValid: true },
  ]);

  const { isLoading: isLoadingTutors, setTutors, tutors } = useFetchTutors(id);

  const tutorAddresses: Array<string> = useMemo(
    () =>
      fields
        .map((field) => (field.isValid ? field.value : ""))
        .filter((address) => address),
    [fields]
  );

  const contractInstance = new Contract(abi, CONTRACT_ADDRESS, provider);

  const { isConnected, address } = useAccount();

  const { sendAsync, isPending } = useSendTransaction({
    calls: undefined,
  });

  const { handlePaste, updateField, removeField, validateAllFields } =
    useDynamicInputs({ fields, setFields });

  const { bootcamp, isLoading } = useGetSingleBootcamp(Number(id));

  if (isLoading || isLoadingTutors) {
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

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateAllFields) {
      return;
    }

    try {
      const call = await contractInstance.populate("add_multiple_tutors", {
        bootcamp_id: Number(id),
        tutors: tutorAddresses,
      });
      await sendAsync([call]);
      setTutors((prev) => prev.concat(tutorAddresses));
      toast.success(`${bootcamp.name}'s tutors added`);
      setFields([{ id: "1", value: "", isValid: true }]);
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while adding tutor");
    }
  };

  const handleInputPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    fieldIndex: number
  ) => {
    const pastedText = e.clipboardData.getData("text");

    // Check if it looks like comma-separated values
    if (pastedText.includes(",")) {
      e.preventDefault();
      handlePaste(pastedText, fieldIndex);
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
          <h1 className="text-3xl font-bold text-gray-900">Tutor Management</h1>
          <p className="mt-2 text-gray-600">{bootcamp.name}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            {tutors.length} tutor{tutors.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Tutor Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Add Tutor</h2>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-4">
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <input
                        placeholder="Enter value"
                        value={field.value}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        onPaste={(e) => handleInputPaste(e, index)}
                        className={`input-field font-mono ${
                          !field.isValid
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                      />
                      {!field.isValid && (
                        <p className="text-red-500 text-sm mt-1">
                          This field cannot be empty
                        </p>
                      )}
                    </div>
                    {fields.length > 1 && (
                      <button
                        onClick={() => removeField(field.id)}
                        className="h-10 w-10 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="animate-spin anim" />
                ) : (
                  "Add Tutors"
                )}
              </button>

              <div className="p-3 bg-primary-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-primary-700">
                    <p className="font-medium mb-1">Tutor Permissions</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Grade assignments</li>
                      <li>• View attendee progress</li>
                      <li>• Access bootcamp data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tutors List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Current Tutors
              </h2>
            </div>

            {tutors.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tutors added yet
                </h3>
                <p className="text-gray-600">
                  Add tutors to help manage assignments and grading.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {tutors.map((tutor, index) => (
                  <div key={tutor} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                          <Shield className="h-6 w-6 text-success-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              Tutor {index + 1}
                            </h3>
                            <CheckCircle className="h-4 w-4 text-success-500" />
                          </div>
                          <p className="text-sm text-gray-600 font-mono">
                            {tutor}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="status-badge status-active text-xs">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tutor Capabilities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tutor Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Assignment Grading</h4>
              <p className="text-sm text-gray-600 mt-1">
                Grade individual and batch assignments for all attendees
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Attendee Progress</h4>
              <p className="text-sm text-gray-600 mt-1">
                View detailed progress and performance metrics for all students
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Bootcamp Access</h4>
              <p className="text-sm text-gray-600 mt-1">
                Access bootcamp data and assist with educational management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorManagement;
