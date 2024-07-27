"use client";
import React, { useEffect } from "react";
import UpContent from "./UpContent";
import RecentOrder from "./RecentOrder";
import { useAuthContext } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DashboardComponent = () => {
  const { role, token } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <UpContent role={role} />
      {role === "admin" ? (
        <>
          <RecentOrder />
        </>
      ) : (
        <div className="flex mt-2 text-gray-900">
          <Link
            href="/"
            className="flex items-center max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6 text-gray-900 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                clipRule="evenodd"
              />
            </svg>
            Landing Page
          </Link>
        </div>
      )}
    </>
  );
};

export default DashboardComponent;
