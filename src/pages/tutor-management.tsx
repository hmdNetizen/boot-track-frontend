import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  UserPlus,
  Users,
  Trash2,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { mockBootcamps, mockTutors } from "../data/mockData";
import { addTutorSchema, type AddTutorFormData } from "../schemas/validation";
import FormField from "../components/shared/form-field";

const TutorManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bootcamp = mockBootcamps.find((b) => b.id === id);
  const [tutors, setTutors] = useState<string[]>(mockTutors);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTutorFormData>({
    resolver: zodResolver(addTutorSchema),
    defaultValues: {
      tutorAddress: "",
    },
  });

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

  const onSubmit = async (data: AddTutorFormData) => {
    // Check if tutor already exists
    if (tutors.includes(data.tutorAddress)) {
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Adding tutor:", { bootcamp: id, tutor: data.tutorAddress });

    setTutors((prev) => [...prev, data.tutorAddress]);
    reset();
  };

  const removeTutor = async (tutorAddress: string) => {
    setIsRemoving(tutorAddress);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Removing tutor:", { bootcamp: id, tutor: tutorAddress });

    setTutors((prev) => prev.filter((tutor) => tutor !== tutorAddress));
    setIsRemoving(null);
  };

  const isTutorAlreadyAdded = (address: string) => {
    return tutors.includes(address);
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                label="Tutor Wallet Address"
                error={errors.tutorAddress}
                required
              >
                <input
                  {...register("tutorAddress")}
                  type="text"
                  placeholder="0x..."
                  className={`input-field ${
                    errors.tutorAddress
                      ? "border-error-300 focus:ring-error-500"
                      : ""
                  }`}
                />
              </FormField>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Tutor"}
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
                          <p className="text-xs text-gray-500 mt-1">
                            Added on {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="status-badge status-active text-xs">
                          Active
                        </span>
                        <button
                          onClick={() => removeTutor(tutor)}
                          disabled={isRemoving === tutor}
                          className="p-2 text-gray-400 hover:text-error-600 rounded-lg hover:bg-error-50 transition-colors disabled:opacity-50"
                          title="Remove tutor"
                        >
                          {isRemoving === tutor ? (
                            <div className="w-4 h-4 border-2 border-error-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
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
