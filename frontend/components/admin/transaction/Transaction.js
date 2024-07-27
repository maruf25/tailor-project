"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { AnimatePresence, motion } from "framer-motion";

import { formatRupiah } from "@/utils/formatRupiah";
import { useAuthContext } from "@/providers/AuthContext";
import usePopupImage from "@/hooks/usePopupImage";
import PopUpImage from "@/components/UI/PopUpImage";
import Pagination from "@/components/UI/Pagination";
import { LoadingSpinner } from "@/components/UI/loadingSpinner";
import { RxRulerSquare } from "react-icons/rx";
import InputRangeAndExportPdf from "@/components/UI/InputRangeAndExportPdf";
import useExportPdf from "@/hooks/useExportPdf";
import CustomModal from "@/components/UI/CustomModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
};

const Transaction = () => {
  moment.locale("id");

  const { startDate, setStartDate, endDate, setEndDate, loading, page, handleExport } =
    useExportPdf();
  const { showImage, setShowImage, handlePopUp, image } = usePopupImage();
  const [showModal, setShowModal] = useState(false);
  const [size, setSize] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [length, setLength] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectPage, setSelectPage] = useState(Number(page) || 1);
  const startNumber = (selectPage - 1) * 4;

  const router = useRouter();
  const { token, role } = useAuthContext();

  const getTransactions = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API + "transactions";

    let params = new URLSearchParams();

    if (searchQuery !== "") {
      params.append("search", searchQuery);
    }

    if (selectPage > 1) {
      params.append("page", selectPage);
    }

    if (startDate !== "" && endDate !== "") {
      params.append("start", startDate);
      params.append("end", endDate);
    }

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await axios.get(url, {
        withCredentials: true,
      });
      const resData = await response.data.transactions;
      setTransactions(resData.rows);
      const numberPage = resData.count / 4;
      setLength(Math.ceil(numberPage));
      if (resData.rows.length === 0) {
        setSelectPage(1);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          alert("Error fetch data");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        alert("Cannot connect to the server. It might be down.");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }

    getTransactions();
  }, [router, searchQuery, selectPage, startDate, endDate]);

  const handleSearch = (e) => {
    setSelectPage(1);
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <AnimatePresence>
        {showImage && <PopUpImage image={image} onShow={() => setShowImage(false)} />}
        {showModal && (
          <CustomModal onShow={() => setShowModal(false)} title="Size Description">
            <motion.ol
              variants={containerVariants}
              initial={"hidden"}
              whileInView={"visible"}
              className="list-disc"
            >
              {size.map((item, index) => (
                <motion.li key={index} variants={itemVariants} className="grid grid-cols-2">
                  <span>{item.label}</span>
                  <span>: {item.value} cm</span>
                </motion.li>
              ))}
            </motion.ol>
          </CustomModal>
        )}
        {loading && <LoadingSpinner />}
      </AnimatePresence>
      <div className="flex flex-col md:justify-between lg:flex-row">
        <div className="flex flex-row items-center pb-4 space-y-0 lg:justify-between lg:flex-column lg:space-y-4">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none rtl:inset-r-0 rtl:right-0 ps-3">
              <svg
                className="w-5 h-5 text-gray-500 "
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              onChange={handleSearch}
              type="text"
              id="table-search"
              className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Search for transaction"
            />
          </div>
        </div>
        <InputRangeAndExportPdf
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleExport={handleExport}
          length={length}
          variant={"transaction"}
          url_be={"transactions/exportPdf"}
        />
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          id="tabletransaction"
          className="w-full text-sm text-left text-gray-500 rtl:text-right "
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3 w-80">
                Date
              </th>
              {role === "admin" && (
                <th scope="col" className="px-6 py-3">
                  Customer Name
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Size
              </th>
              {role === "admin" && (
                <th scope="col" className="px-6 py-3">
                  Image
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {length === 0 && (
              <tr className="bg-white border-b hover:bg-gray-50 ">
                <td
                  scope="row"
                  colSpan={5}
                  className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                >
                  No Transaction Found
                </td>
              </tr>
            )}
            {transactions.map((transaction, key) => (
              <tr key={key} className="bg-white border-b hover:bg-gray-50 ">
                <td className="px-6 py-4">{startNumber + key + 1}</td>
                <td className="px-6 py-4">{moment(transaction.updatedAt).format("LLLL")}</td>
                {role === "admin" && (
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    <a href={"/dashboard/invoice/" + transaction.id}>{transaction.user.name}</a>
                  </th>
                )}
                <td className="px-6 py-4">{transaction.name}</td>
                <td className="px-6 py-4 ">
                  <button
                    className="flex text-gray-900 border items-center focus:outline-none  bg-gray-50 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    type="button"
                    onClick={() => {
                      const dataSize = [
                        { label: "Panjang bahu", value: transaction.bahu },
                        { label: "Panjang Dada", value: transaction.dada },
                        { label: "Panjang Tangan", value: transaction.panjang_tangan },
                        { label: "Panjang Badan", value: transaction.panjang_badan },
                        { label: "Lebar Tangan", value: transaction.lebar_tangan },
                        { label: "Lebar Depan", value: transaction.lebar_depan },
                        { label: "Lebar Belakang", value: transaction.lebar_belakang },
                        { label: "Lebar Pinggang", value: transaction.lebar_pinggang },
                        { label: "Lebar Pinggul", value: transaction.lebar_pinggul },
                      ];
                      setSize(dataSize);
                      setShowModal(true);
                    }}
                    title="Size Description"
                  >
                    <RxRulerSquare />
                  </button>
                </td>
                {role === "admin" && (
                  <td className="px-6 py-4">
                    <img
                      src={process.env.NEXT_PUBLIC_API + transaction.image}
                      alt="image"
                      className="h-[200px] w-[200px] object-contain"
                      onClick={handlePopUp.bind(
                        this,
                        process.env.NEXT_PUBLIC_API + transaction.image
                      )}
                    />
                  </td>
                )}
                <td className="px-6 py-4">{formatRupiah(transaction.price.toString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination length={length} onClick={setSelectPage} selectPage={selectPage} />
    </>
  );
};

export default Transaction;
