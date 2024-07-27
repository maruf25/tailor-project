import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/utils/formatRupiah";

const UpContent = ({ role }) => {
  const router = useRouter();
  const [data, setData] = useState({});

  const getDashboard = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API + "dashboard", {
        withCredentials: true,
      });
      const resData = response.data;
      setData(resData);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          alert("Something went wrong");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        alert("Cannot connect to the server. It might be down.");
      }
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 lg:space-x-4 lg:grid-cols-4">
      {role === "admin" && (
        <>
          <Link
            href="/dashboard/transaction"
            className="flex items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
          >
            <svg
              className="w-12 h-12 mr-4 text-gray-900"
              // width="24"
              // height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="12" cy="12" r="9" />
              <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
              <path d="M12 6v2m0 8v2" />
            </svg>
            <div>
              <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 lg:text-lg ">
                {formatRupiah(`${data.total_pendapatan}`)}
              </h5>
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">Total Income</p>
            </div>
          </Link>

          <Link
            href="/dashboard/spending"
            className="flex items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
          >
            <svg
              className="w-12 h-12 mr-4 text-gray-900"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />{" "}
              <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
            </svg>
            <div>
              <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 lg:text-lg ">
                {formatRupiah(`${data.total_pengeluaran}`)}
              </h5>
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">Total Spending</p>
            </div>
          </Link>
        </>
      )}
      <Link
        href="/dashboard/transaction"
        className="flex items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
      >
        <svg
          className="w-12 h-12 mr-4 text-gray-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 14 20"
        >
          <path d="M13.383.076a1 1 0 0 0-1.09.217L11 1.586 9.707.293a1 1 0 0 0-1.414 0L7 1.586 5.707.293a1 1 0 0 0-1.414 0L3 1.586 1.707.293A1 1 0 0 0 0 1v18a1 1 0 0 0 1.707.707L3 18.414l1.293 1.293a1 1 0 0 0 1.414 0L7 18.414l1.293 1.293a1 1 0 0 0 1.414 0L11 18.414l1.293 1.293A1 1 0 0 0 14 19V1a1 1 0 0 0-.617-.924ZM10 15H4a1 1 0 1 1 0-2h6a1 1 0 0 1 0 2Zm0-4H4a1 1 0 1 1 0-2h6a1 1 0 1 1 0 2Zm0-4H4a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
        </svg>
        <div>
          <h5 className="mb-2 font-bold tracking-tight text-gray-900 text-md lg:text-lg ">
            {data.total_transaksi}
          </h5>
          <p className="text-sm font-normal text-gray-700 dark:text-gray-400">Total Transaction</p>
        </div>
      </Link>
      <Link
        href="/dashboard/order"
        className="flex items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
      >
        <svg
          className="w-12 h-12 mr-4 text-gray-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        <div>
          <h5 className="mb-2 font-bold tracking-tight text-gray-900 text-md lg:text-lg ">
            {data.total_booking}
          </h5>
          <p className="text-sm font-normal text-gray-700 dark:text-gray-400">Total Order</p>
        </div>
      </Link>
    </div>
  );
};

export default UpContent;
