import { useMemo, useState } from "react";
import DynamicInputFields from "./shared/dynamic-input-field";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { abi } from "../lib/abi";
import { useDynamicInputs, type InputField } from "../hooks/use-dynamic-input";
import toast from "react-hot-toast";
import { Contract } from "starknet";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { provider } from "../lib/rpc-provider";
import AttendeeItem from "./attendee-item";
import { useFetchAttendees } from "../hooks/use-fetch-attendees";
import { Loader2 } from "lucide-react";

type AttendeesProps = {
  totalSessions: number;
  id: number;
};

type TBootcampAttendeeRecord = {
  userWalletAddress: bigint;
  attendeeInfo: {
    is_registered: boolean;
    attendance_count: bigint;
    graduation_status: bigint;
    total_assignment_score: bigint;
  };
};

export type TBootcampAttendeeRecords = Array<TBootcampAttendeeRecord>;

export type TAttendee = {
  address: string;
  attendanceCount: number;
  graduationStatus: number;
  totalAssignmentScore: number;
};

export default function Attendees({ totalSessions, id }: AttendeesProps) {
  const [showAddAttendees, setShowAttendees] = useState(false);
  const [fields, setFields] = useState<InputField[]>([
    { id: "1", value: "", isValid: true },
  ]);

  const { handlePaste, updateField, addField, removeField, validateAllFields } =
    useDynamicInputs({ fields, setFields });

  const attendeeAddresses: Array<string> = useMemo(
    () =>
      fields
        .map((field) => (field.isValid ? field.value : ""))
        .filter((address) => address),
    [fields]
  );

  const { address, isConnected } = useAccount();

  const { sendAsync, isPending } = useSendTransaction({
    calls: undefined,
  });

  const contractInstance = new Contract(abi, CONTRACT_ADDRESS, provider);

  const { attendeesList, isLoading, setAttendeesList } = useFetchAttendees(
    id.toString()
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
        bootcamp_id: id,
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Registered Attendees
        </h2>
        <button
          className="btn-secondary flex items-center gap-2"
          onClick={() => setShowAttendees((prev) => !prev)}
        >
          {/* <UserPlus className="h-4 w-4" /> */}
          Add Attendees
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {showAddAttendees ? (
          <DynamicInputFields
            fields={fields}
            addField={addField}
            handlePaste={handlePaste}
            removeField={removeField}
            updateField={updateField}
            onRegister={onRegisterAttendeesHandler}
            isPending={isPending}
          />
        ) : null}
        {isLoading ? (
          <div className="min-h-[50px] flex justify-center items-center">
            <Loader2 className="animate-spin size-11" />
          </div>
        ) : (
          attendeesList.map((attendee, index) => {
            return (
              <AttendeeItem
                key={attendee.address}
                index={index}
                attendee={attendee}
                bootcampId={id}
                totalSessions={totalSessions}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
