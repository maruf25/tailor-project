"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useAuthContext } from "@/providers/AuthContext";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import "moment/locale/id";
import { FaEdit } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";

import useToast from "@/hooks/useToast";
import useDeleteModal from "@/hooks/useModal";
import Modal from "@/components/UI/Modal";
import Pagination from "@/components/UI/Pagination";
import { LoadingSpinner } from "@/components/UI/loadingSpinner";
import useExportPdf from "@/hooks/useExportPdf";
import InputRangeAndExportPdf from "@/components/UI/InputRangeAndExportPdf";

const InventoryComponent = () => {
  moment.locale("id");
  const { startDate, setStartDate, endDate, setEndDate, loading, page, handleExport } =
    useExportPdf();
  const { showModal, handleShowModal, selectProduct, setShowModal } = useDeleteModal();
  const { notify } = useToast();
  const [inventories, setInventories] = useState([]);
  const { token } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [length, setLength] = useState(0);
  const [selectPage, setSelectPage] = useState(Number(page) || 1);

  const startNumber = (selectPage - 1) * 10;

  const regex = /kain/i;

  const router = useRouter();

  const getInventories = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API + "inventories";

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
      const resData = await response.data.inventories;
      setInventories(resData.rows);
      const numberPage = resData.count / 10;
      setLength(Math.ceil(numberPage));
      if (resData.rows.length === 0) {
        setSelectPage(1);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else if (error.response.status === 500) {
          router.push("/login");
        }
        notify("error", "Error fetch data");
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }

    getInventories();
  }, [router, searchQuery, selectPage, startDate, endDate]);

  const handleSearch = (e) => {
    setSelectPage(1);
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (inventoryId) => {
    try {
      const response = await axios.delete(
        process.env.NEXT_PUBLIC_API + "inventories/" + inventoryId,
        {
          withCredentials: true,
        }
      );
      const resData = await response.data;
      getInventories();
      setShowModal(false);
      notify("success");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else if (error.response.status === 500) {
          router.push("/login");
        }
        notify("error", "Error delete, try again!");
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
      setShowModal(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <Modal
            onShow={handleShowModal}
            onConfirm={handleDelete.bind(this, selectProduct)}
            title={"reset quantity"}
          />
        )}
        {loading && <LoadingSpinner />}
      </AnimatePresence>
      <ToastContainer />
      <div className="flex flex-col ">
        <div className="flex flex-wrap items-center justify-between pb-4 space-y-4 flex-column sm:flex-row sm:space-y-0">
          <div className="flex items-center">
            <Link
              href={"/dashboard/inventory/add"}
              title="Add Inventory"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-2xl px-5 py-2.5 me-2 mb-2"
            >
              <IoAdd />
            </Link>
          </div>
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
          variant={"inventory"}
          url_be={"inventories/exportPdf"}
        />
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          id="tableinventory"
          className="w-full text-sm text-left text-gray-500 rtl:text-right "
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th id="actionHeader" scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {inventories.length === 0 && (
              <tr className="bg-white border-b hover:bg-gray-50 ">
                <td
                  scope="row"
                  colSpan={6}
                  className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                >
                  No Inventory Found
                </td>
              </tr>
            )}
            {inventories.map((inventory, key) => (
              <tr key={key} className="bg-white border-b hover:bg-gray-50 ">
                <td className="px-6 py-4">{startNumber + key + 1}</td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {inventory.name}
                </th>
                <td className="px-6 py-4">{inventory.description}</td>
                <td className="px-6 py-4">
                  {inventory.quantity} {regex.test(inventory.name) ? "m" : "pcs"}
                </td>
                <td id="actionCell" className="flex items-center px-6 py-4 space-x-2">
                  <Link
                    href={"/dashboard/inventory/edit/" + inventory.id}
                    title="Edit Inventory"
                    className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold rounded-full text-sm px-5 py-2.5 text-center"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    title="Reset Inventory"
                    className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                    onClick={handleShowModal.bind(this, inventory.id)}
                  >
                    <GrPowerReset />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination length={length} onClick={setSelectPage} selectPage={selectPage} />
    </>
  );
};

export default InventoryComponent;
