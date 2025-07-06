import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateBootcamp from "./pages/CreateBootcamp";
import BootcampDetails from "./pages/BootcampDetails";
import AttendanceManagement from "./pages/AttendanceManagement";
import AssignmentGrading from "./pages/AssignmentGrading";
import GraduationProcessing from "./pages/GraduationProcessing";
import AttendeeView from "./pages/AttendeeView";
import { useAccount, useContract } from "@starknet-react/core";
import { abi } from "./lib/abi";
import { provider } from "./lib/rpc-provider";
import { num } from "starknet";
import { CONTRACT_ADDRESS } from "./lib/contract-address";
import TutorManagement from "./pages/tutor-management";
import AttendeeManagement from "./pages/attendee-management";

export type BootcampData = {
  id: number;
  name: string;
  assignmentMaxScore: number;
  organizer: string;
  totalWeeks: number;
  isActive: boolean;
  numOfAttendees: number;
  sessionsPerWeek: number;
  createdAt: Date;
};

type RawBootcampData = {
  assignment_max_score: bigint;
  created_at: bigint;
  is_active: boolean;
  name: string;
  num_of_attendees: bigint;
  organizer: bigint;
  sessions_per_week: bigint;
  total_weeks: bigint;
};

// If your result array structure is [unknown, RawBootcampData]
type ResultTuple = [unknown, RawBootcampData];

function App() {
  const { address } = useAccount();
  const [bootcamps, setBootcamps] = useState<BootcampData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const { contract } = useContract({
    abi,
    address: CONTRACT_ADDRESS,
    provider,
  });

  useEffect(() => {
    const fetchBootcamps = async () => {
      if (!contract) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await contract.get_all_bootcamps();
        const bootcamps = result.map((result, index) => {
          const bootcampData = result as ResultTuple;
          return {
            id: index + 1,
            name: bootcampData[1].name,
            assignmentMaxScore: Number(bootcampData[1]?.assignment_max_score),
            organizer: num.toHex(bootcampData[1]?.organizer),
            totalWeeks: Number(bootcampData[1]?.total_weeks),
            isActive: Boolean(bootcampData[1]?.is_active),
            numOfAttendees: Number(bootcampData[1]?.num_of_attendees),
            sessionsPerWeek: Number(bootcampData[1]?.sessions_per_week),
            createdAt: new Date(Number(bootcampData[1]?.created_at) * 1000),
          };
        });
        setBootcamps(bootcamps);
      } catch (err: any) {
        console.error("Contract call error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBootcamps();
  }, [contract, address]);

  return (
    <>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Dashboard bootcamps={bootcamps} isLoading={isLoading} />}
          />
          <Route
            path="/create-bootcamp"
            element={<CreateBootcamp setBootcamps={setBootcamps} />}
          />
          <Route path="/bootcamp/:id" element={<BootcampDetails />} />
          <Route
            path="/bootcamp/:id/attendees"
            element={<AttendeeManagement />}
          />
          <Route
            path="/bootcamp/:id/attendance"
            element={<AttendanceManagement />}
          />
          <Route
            path="/bootcamp/:id/assignments"
            element={<AssignmentGrading />}
          />
          <Route
            path="/bootcamp/:id/graduation"
            element={<GraduationProcessing />}
          />
          <Route path="/bootcamp/:id/tutors" element={<TutorManagement />} />
          <Route
            path="/bootcamp/:id/attendance"
            element={<AttendanceManagement />}
          />
          <Route path="/attendee/:bootcampId" element={<AttendeeView />} />
        </Routes>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
