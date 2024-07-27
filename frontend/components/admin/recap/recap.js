"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { formatRupiah } from "@/utils/formatRupiah";
import { useAuthContext } from "@/providers/AuthContext";

import { LoadingSpinner } from "@/components/UI/loadingSpinner";
import "@/utils/Poppins-Regular-normal";
import ChartBarRecap from "@/components/UI/ChartBarRecap";

const recapComponent = () => {
  moment.locale("id");
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const initialStart = start
    ? moment(start).format("YYYY-MM-DD")
    : moment().startOf("month").format("YYYY-MM-DD");
  const initialEnd = end ? moment(end).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
  const [recaps, setRecaps] = useState([]);
  const [total, setTotal] = useState({});
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuthContext();

  const getTransactions = async () => {
    let url = process.env.NEXT_PUBLIC_API + "recap/";
    if (startDate !== "" && endDate !== "") {
      url =
        process.env.NEXT_PUBLIC_API +
        "recap?start=" +
        encodeURIComponent(startDate.toString()) +
        "&" +
        "end=" +
        encodeURIComponent(endDate.toString());
    }
    try {
      const response = await axios.get(url, {
        withCredentials: true,
      });
      const resData = await response.data;
      const total = {
        totalIncome: resData.totalIncome,
        totalSpending: resData.totalSpending,
        saldo: resData.saldo,
      };
      setRecaps(resData.data);
      setTotal(total);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          alert("error", "Error fetch data");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        alert("error", "Cannot connect to the server. It might be down.");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }

    getTransactions();
  }, [router, startDate, endDate]);

  const handleExport = async () => {
    const fileName = `Recap ${startDate} sampai ${endDate}.pdf`;

    if (
      !moment(startDate, "YYYY-MM-DD", true).isValid() ||
      !moment(endDate, "YYYY-MM-DD", true).isValid()
    ) {
      console.error("Invalid date format");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API + "exportPdf",
        {
          start: startDate.toString(),
          end: endDate.toString(),
          recaps,
          total,
        },
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          alert("Error export pdf, try again!");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        alert("Cannot connect to the server. It might be down.");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      <div className="flex flex-col md:justify-between lg:flex-row">
        <div className="flex items-center">
          <span className="mx-4 text-gray-500">from</span>
          <input
            id="startDate"
            type="date"
            name="startDate"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            value={startDate}
            onChange={(e) => setStartDate(moment(e.target.value).format("YYYY-MM-DD"))}
            max={endDate.toString()}
            required
          />

          <span className="mx-4 text-gray-500">to</span>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={endDate}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            onChange={(e) => setEndDate(moment(e.target.value).format("YYYY-MM-DD"))}
            min={startDate.toString()}
            max={moment().format("YYYY-MM-DD")}
            required
          />
        </div>
        <button
          className="flex items-center justify-center mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2  focus:outline-none "
          onClick={handleExport}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"
            />
          </svg>
          Export Pdf
        </button>
      </div>
      {/* <div className="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table id="tableRecap" className="w-full text-sm text-left text-gray-500 rtl:text-right ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Masuk
              </th>
              <th scope="col" className="px-6 py-3">
                Keluar
              </th>
            </tr>
          </thead>
          <tbody>
            {recaps.length === 0 && (
              <tr className="bg-white border-b hover:bg-gray-50 ">
                <td
                  scope="row"
                  colSpan={5}
                  className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                >
                  No Data Found
                </td>
              </tr>
            )}
            {recaps.map((recap, key) => (
              <tr key={key} className="bg-white border-b hover:bg-gray-50 ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {key + 1}
                </th>
                <td className="px-6 py-4 font-bold">
                  {recap.tipe === "masuk" ? (
                    <p className="text-green-700">PEMASUKAN</p>
                  ) : (
                    <p className="text-red-700">PENGELUARAN</p>
                  )}
                </td>
                <td className="px-6 py-4">{moment(recap.date).format("LLLL")}</td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {recap.name}
                </th>
                <td className="px-6 py-4 text-right">
                  {recap.tipe === "masuk" ? formatRupiah(recap.amount.toString()) : 0}
                </td>
                <td className="px-6 py-4 text-right">
                  {recap.tipe === "keluar" ? formatRupiah(recap.amount.toString()) : 0}
                </td>
              </tr>
            ))}
            <tr className="bg-white border-b hover:bg-gray-50 ">
              <td
                colSpan="4"
                scope="row"
                className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
              >
                Total Pemasukan dan Pengeluaran
              </td>
              <td className="px-6 py-4 text-right">
                {total?.totalIncome ? formatRupiah(total.totalIncome.toString()) : 0}
              </td>
              <td className="px-6 py-4 text-right">
                {total?.totalSpending ? formatRupiah(total.totalSpending.toString()) : 0}
              </td>
            </tr>
            <tr className="bg-white border-b hover:bg-gray-50 ">
              <td
                colSpan="4"
                scope="row"
                className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
              >
                Saldo
              </td>
              <td colSpan={"2"} className="px-6 py-4 text-center">
                {total?.saldo ? formatRupiah(total.saldo.toString()) : 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}

      <div className="flex flex-col items-center justify-center p-4 font-bold text-center text-gray-900">
        <h1>Pemasukan dan Pengeluaran</h1>
        <h1>
          Periode : {moment(startDate).format("DD MMMM YYYY")} sampai{" "}
          {moment(endDate).format("DD MMMM YYYY")}
        </h1>
      </div>

      <ChartBarRecap recaps={recaps} total={total} />
    </div>
  );
};

export default recapComponent;
