import { useEffect, useState } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { abi } from "../lib/abi";
import { provider } from "../lib/rpc-provider";
import type { BootcampTuple, SingleBootcamp } from "../pages/BootcampDetails";

export function useGetSingleBootcamp(bootcampId: number | undefined) {
  const { address } = useAccount();
  const { contract } = useContract({
    abi: abi,
    address: CONTRACT_ADDRESS,
    provider,
  });

  const [bootcamp, setBootcamp] = useState<SingleBootcamp | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>("");

  useEffect(() => {
    if (bootcampId) {
      const fetchBootcamp = async () => {
        if (!contract) return;

        setIsLoading(true);
        setError(null);

        try {
          const result = await contract.get_bootcamp_info(Number(bootcampId));
          const item = result as BootcampTuple;
          const bootcampData: SingleBootcamp = {
            id: Number(bootcampId),
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
    }
  }, [contract, address, bootcampId]);

  return { bootcamp, isLoading, error };
}
