"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { IoAdd } from "react-icons/io5";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import Modal from "@/components/UI/Modal";
import useDeleteModal from "@/hooks/useModal";
import useToast from "@/hooks/useToast";
import Pagination from "@/components/UI/Pagination";

const CustomerComponent = () => {
  const { showModal, handleShowModal, selectProduct, setShowModal } = useDeleteModal();
  const { notify } = useToast();
  const [customers, setCustomer] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [length, setLength] = useState(0);
  const [selectPage, setSelectPage] = useState(1);

  const startNumber = (selectPage - 1) * 10;

  const router = useRouter();

  const getCustomers = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API + "customer?search=" + searchQuery + "&page=" + selectPage,
        {
          withCredentials: true,
        }
      );
      const resData = await response.data.customers;
      setCustomer(resData.rows);
      const numberPage = resData.count / 10;
      setLength(Math.ceil(numberPage));
      if (resData.rows.length === 0) {
        setSelectPage(1);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          notify("error", "Error fetch data");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error","Cannot connect to the server. It might be down.");
      }
    }
  };

  useEffect(() => {
    getCustomers();
  }, [searchQuery, selectPage]);

  const handleSearch = (e) => {
    setSelectPage(1);
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (customerId) => {
    try {
      const response = await axios.delete(process.env.NEXT_PUBLIC_API + "customer/" + customerId, {
        withCredentials: true,
      });
      const resData = await response.data;
      // console.log(resData);
      getCustomers();
      setShowModal(false);
      notify("success");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        }
        notify("error", error.response.data.message);
        // console.log(error.response.data.message);
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
      setShowModal(false);
    }
  };

  return (
    <>
      <div>
        {showModal && (
          <Modal onShow={handleShowModal} onConfirm={handleDelete.bind(this, selectProduct)} />
        )}
        <ToastContainer />

        <div className="flex flex-wrap items-center justify-between pb-4 space-y-4 flex-column sm:flex-row sm:space-y-0">
          <div className="flex items-center">
            <Link
              href={"/dashboard/customer/add"}
              title="Add Customer"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-2xl px-5 py-2.5 me-2 mb-2"
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
              placeholder="Search for customer"
            />
          </div>
        </div>

        <div className="relative mt-5 overflow-x-auto overflow-y-hidden shadow-md sm:rounded-lg">
          <motion.table className="w-full text-sm text-left text-gray-500 rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <motion.tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  No Whatsapp
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </motion.tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {customers.length === 0 && (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border-b "
                  >
                    <td
                      scope="row"
                      colSpan={5}
                      className="px-6 py-4 font-medium text-center text-gray-900 "
                    >
                      No Customer Found
                    </td>
                  </motion.tr>
                )}
                {customers.map((customer, key) => (
                  <motion.tr
                    layout
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border-b "
                    key={key}
                  >
                    <td className="px-6 py-4">{startNumber + key + 1}</td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 ">
                      {customer.name}
                    </th>
                    <td className="px-6 py-4">{customer.username}</td>
                    <td className="px-6 py-4">{customer.no_whatsapp}</td>
                    <td className="flex items-center px-6 py-4 space-x-2">
                      <Link
                        href={"customer/edit/" + customer.id}
                        title="Edit Customer"
                        className=" text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold rounded-full text-sm px-5 py-2.5 text-center "
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className=" text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
                        onClick={handleShowModal.bind(this, customer.id)}
                        title="Delete Customer"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      </div>
      <Pagination length={length} onClick={setSelectPage} selectPage={selectPage} />
    </>
  );
};

export default CustomerComponent;
