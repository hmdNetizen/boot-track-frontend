import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, User, Loader2 } from "lucide-react";
import { Contract } from "starknet";

import { useGetSingleBootcamp } from "../hooks/use-get-single-bootcamp";
import { useFetchAttendees } from "../hooks/use-fetch-attendees";
import DynamicInputFields from "../components/shared/dynamic-input-field";
import { useDynamicInputs, type InputField } from "../hooks/use-dynamic-input";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import toast from "react-hot-toast";
import { abi } from "../lib/abi";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { provider } from "../lib/rpc-provider";
import type { TAttendee } from "../components/attendees";
import AttendeeItem from "../components/attendee-item";
import BootcampNotFound from "../components/shared/bootcamp-not-found";
import LoadingSpinner from "../components/shared/loading-spinner";

const AttendeeManagement = () => {
  const { id } = useParams<{ id: string }>();
  const [fields, setFields] = useState<InputField[]>([
    { id: "1", value: "", isValid: true },
  ]);

  const { address, isConnected } = useAccount();

  const contractInstance = new Contract(abi, CONTRACT_ADDRESS, provider);

  // eslint-disabled-next-line
  const { bootcamp, isLoading } = useGetSingleBootcamp(Number(id));
  const {
    attendeesList,
    isLoading: isLoadingAttendees,
    setAttendeesList,
  } = useFetchAttendees(id);

  const { handlePaste, updateField, addField, removeField, validateAllFields } =
    useDynamicInputs({ fields, setFields });

  const { sendAsync, isPending } = useSendTransaction({
    calls: undefined,
  });

  const attendeeAddresses: Array<string> = useMemo(
    () =>
      fields
        .map((field) => (field.isValid ? field.value : ""))
        .filter((address) => address),
    [fields]
  );

  const handleValidate = () => {
    const isValid = validateAllFields();
    if (isValid) {
      return true;
    } else {
      return false;
    }
  };

  const onRegisterAttendeesHandler = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!handleValidate()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const call = contractInstance.populate("register_attendees", {
        bootcamp_id: Number(id),
        attendees: attendeeAddresses,
      });

      await sendAsync([call]);

      const attendeesData: Array<TAttendee> = attendeeAddresses.map((add) => ({
        address: add,
        attendanceCount: 0,
        graduationStatus: 0,
        totalAssignmentScore: 0,
      }));

      setAttendeesList((prev) => prev.concat(attendeesData));

      setFields([{ id: "1", value: "", isValid: true }]);

      if (attendeeAddresses.length === 1) {
        toast.success("A new attendee has been added to the bootcamp");
      } else {
        toast.success("Attendees have been added to the bootcamp");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading || isLoadingAttendees) {
    return <LoadingSpinner />;
  }

  if (!bootcamp) {
    return <BootcampNotFound />;
  }

  const totalSessions = bootcamp.totalWeeks * bootcamp.sessionsPerWeek;

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
            Attendee Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-400">
            {bootcamp.name}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            {attendeesList.length} attendee
            {attendeesList.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Register Attendees Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-2 px-1 dark:bg-gray-800 dark:border-gray-600">
            <DynamicInputFields
              fields={fields}
              addField={addField}
              handlePaste={handlePaste}
              removeField={removeField}
              updateField={updateField}
              onRegister={onRegisterAttendeesHandler}
              isPending={isPending}
            />
          </div>
        </div>

        {/* Attendees List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-600">
            <div className="px-2 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-200">
                Registered Attendees
              </h2>
            </div>

            {attendeesList.length === 0 ? (
              <div className="p-12 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No attendees registered yet
                </h3>
                <p className="text-gray-600">
                  Register attendees to start tracking their progress.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {attendeesList.map((attendee, index) => {
                  return (
                    <AttendeeItem
                      key={attendee.address}
                      index={index}
                      attendee={attendee}
                      bootcampId={Number(id)}
                      totalSessions={totalSessions}
                    />
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Registration Statistics */}
      {attendeesList.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-300">
            Registration Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {attendeesList.length}
              </div>
              <div className="text-sm text-gray-600">Total Registered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {attendeesList.filter((a) => a.attendanceCount > 0).length}
              </div>
              <div className="text-sm text-gray-600">Active Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {attendeesList.filter((a) => a.graduationStatus >= 2).length}
              </div>
              <div className="text-sm text-gray-600">Graduates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600">
                {Math.round(
                  attendeesList.reduce((acc, a) => {
                    return acc + (a.attendanceCount / totalSessions) * 100;
                  }, 0) / attendeesList.length
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Avg. Attendance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeManagement;
