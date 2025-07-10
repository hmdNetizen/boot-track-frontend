import { useEffect, useState } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { abi } from "../lib/abi";
import { provider } from "../lib/rpc-provider";
import type {
  TAttendee,
  TBootcampAttendeeRecords,
} from "../components/attendees";

export const useFetchAttendees = (bootcampId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | "">("");
  const [attendeesList, setAttendeesList] = useState<Array<TAttendee>>([]);

  const { address } = useAccount();
  const { contract } = useContract({
    abi,
    address: CONTRACT_ADDRESS,
    provider,
  });

  console.log(attendeesList);

  useEffect(() => {
    if (bootcampId) {
      const fetchAttendees = async () => {
        if (!contract) return;

        setIsLoading(true);
        setError(null);

        try {
          const result = await contract.get_all_attendees(Number(bootcampId));
          const data = result as TBootcampAttendeeRecords;
          const attendees: Array<TAttendee> = data.map((attendee: any) => {
            const formattedAddress = `0x${attendee[0].toString(16)}`;
            return {
              address: formattedAddress,
              attendanceCount: Number(attendee[1].attendance_count),
              totalAssignmentScore: Number(attendee[1].total_assignment_score),
              graduationStatus: Number(attendee[1].graduation_status),
            };
          });

          setAttendeesList(attendees);
        } catch (err: any) {
          console.error("Contract call error:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAttendees();
    }
  }, [contract, address, bootcampId]);

  return { isLoading, error, attendeesList, setAttendeesList };
};
