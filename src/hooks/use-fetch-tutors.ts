import { useEffect, useState } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../lib/contract-address";
import { abi } from "../lib/abi";
import { provider } from "../lib/rpc-provider";
import { num } from "starknet";

export const useFetchTutors = (bootcampId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | "">("");
  const [tutors, setTutors] = useState<Array<string>>([]);

  const { address } = useAccount();
  const { contract } = useContract({
    abi,
    address: CONTRACT_ADDRESS,
    provider,
  });

  useEffect(() => {
    if (bootcampId) {
      const fetchAttendees = async () => {
        if (!contract) return;

        setIsLoading(true);
        setError(null);

        try {
          const result = await contract.get_all_tutors(Number(bootcampId));
          const data = result as Array<string>;

          setTutors(data.map((address) => num.toHex(address)));
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

  return { isLoading, error, tutors, setTutors };
};
