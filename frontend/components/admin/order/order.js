"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { FaEdit, FaImage, FaTrashAlt } from "react-icons/fa";
import { MdOutlineDoneOutline } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { RiMailSendLine } from "react-icons/ri";
import { RxRulerSquare } from "react-icons/rx";
import { IoAdd } from "react-icons/io5";

import { useAuthContext } from "@/providers/AuthContext";
import { formatRupiah } from "@/utils/formatRupiah";
import CountdownTimer from "@/utils/CountdownTimer";

import CustomModal from "@/components/UI/CustomModal";
import useDeleteModal from "@/hooks/useModal";
import Modal from "@/components/UI/Modal";
import useToast from "@/hooks/useToast";
import usePopupImage from "@/hooks/usePopupImage";
import PopUpImage from "@/components/UI/PopUpImage";
import { LoadingSpinner } from "@/components/UI/loadingSpinner";
import Pagination from "@/components/UI/Pagination";
import useExportPdf from "@/hooks/useExportPdf";
import InputRangeAndExportPdf from "@/components/UI/InputRangeAndExportPdf";

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

const keterangan_size = [
  { label: "bahu", value: "Panjang bahu" },
  { label: "dada", value: "Panjang Dada" },
  { label: "pt", value: "Panjang Tangan" },
  { label: "pb", value: "Panjang Badan" },
  { label: "lt", value: "Lebar Tangan" },
  { label: "ld", value: "Lebar Depan" },
  { label: "lb", value: "Lebar Belakang" },
  { label: "lpgang", value: "Lebar Pinggang" },
  { label: "lpgul", value: "Lebar Pinggul" },
];

const OrderComponent = () => {
  moment.locale("id");
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading: exportLoading,
    page,
    handleExport,
  } = useExportPdf();
  const { showModal, handleShowModal, selectProduct, setShowModal } = useDeleteModal();
  const { showImage, setShowImage, handlePopUp, image } = usePopupImage();
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState(0);
  const [selectPage, setSelectPage] = useState(Number(page) || 1);
  const startNumber = (selectPage - 1) * 5;
  const [size, setSize] = useState([]);

  const router = useRouter();
  const { token, role } = useAuthContext();

  const getOrders = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API + "orders";

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

      setOrders(resData.rows);
      const numberPage = resData.count / 5;
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
        alert("Cannot connect to the server. It might be down.");
      }
    }
  };

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }

    getOrders();
  }, [router, searchQuery, selectPage, startDate, endDate]);

  const handleSearch = (e) => {
    setSelectPage(1);
    setSearchQuery(e.target.value);
  };

  const handleDone = async (orderId) => {
    try {
      setLoading(true);
      const getOrder = await axios.get(process.env.NEXT_PUBLIC_API + "transactions/" + orderId, {
        withCredentials: true,
      });

      const orderData = getOrder.data.transaction;
      orderData.customerId = orderData.user.id;
      orderData.status = "selesai";

      const updateData = await axios.put(
        process.env.NEXT_PUBLIC_API + "transactions/" + orderId,
        orderData,
        {
          withCredentials: true,
        }
      );
      const resData = updateData.data;
      notify("success", "update selesai success!!");
      getOrders();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          notify("error", "Error update data");
        }
        notify("error", "update error, try again later!");
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
    }
    setLoading(false);
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await axios.delete(process.env.NEXT_PUBLIC_API + "transactions/" + orderId, {
        withCredentials: true,
      });
      const resData = await response.data;
      getOrders();
      setShowModal(false);
      notify("success");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          notify("error");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
      setShowModal(false);
    }
  };

  const handleSendInvoice = async (order) => {
    try {
      setLoading(true);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API + "invoice/" + order.invoiceId,
        {
          name: order.name,
          no_whatsapp: order.no_whatsapp,
          status: order.status,
        },
        {
          withCredentials: true,
        }
      );
      notify("success", "send invoice sucess");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          notify("error", "send invoice error, try again later!");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <AnimatePresence>
        {showModal && selectProduct !== null && (
          <Modal onShow={handleShowModal} onConfirm={handleDelete.bind(this, selectProduct)} />
        )}
        {showImage && <PopUpImage image={image} onShow={() => setShowImage(false)} />}
        {showModal && selectProduct === null && (
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
        {(loading || exportLoading) && <LoadingSpinner />}
      </AnimatePresence>
      <ToastContainer />
      <div className="flex flex-col">
        <div className="flex flex-col pb-4 space-y-0 lg:items-center lg:flex-row lg:justify-between ">
          <div className="flex items-center">
            {role === "admin" && (
              <Link
                href="/dashboard/order/add"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-2xl px-5 py-2.5 me-2 mb-2"
                title="Add Order"
              >
                <IoAdd />
              </Link>
            )}
          </div>
          <div>
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
                value={searchQuery}
                onChange={handleSearch}
                type="text"
                id="table-search"
                className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for order"
              />
            </div>
          </div>
        </div>
        {role === "admin" && (
          <InputRangeAndExportPdf
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            handleExport={handleExport}
            length={length}
            variant={"order"}
            url_be={"orders/exportPdf"}
          />
        )}
      </div>
      <div className="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table id="tableorder" className="w-full text-sm text-left text-gray-500 rtl:text-right ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              {role === "admin" && (
                <th scope="col" className="px-6 py-3">
                  username
                </th>
              )}
              {/* <th id="imageHeader" scope="col" className="px-6 py-3">
                Image
              </th> */}
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Size
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Deadline
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              {role === "admin" && (
                <th id="actionHeader" scope="col" className="px-6 py-3">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr className="bg-white border-b ">
                <td
                  scope="row"
                  colSpan={10}
                  className="px-6 py-4 font-medium text-center text-gray-900 "
                >
                  No Product Found
                </td>
              </tr>
            )}
            {orders.map((order, key) => (
              <tr className="bg-white border-b " key={key}>
                <td className="px-6 py-4">{startNumber + key + 1}</td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 ">
                  {role === "admin" ? `(${order.user.name})` : ""} {order.name}
                </th>
                {role === "admin" && <td className="px-6 py-4">{order.user.username}</td>}
                <td className="px-6 py-4 ">
                  <button
                    className="flex text-gray-900 border items-center focus:outline-none  bg-gray-50 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                    type="button"
                    onClick={() => {
                      const dataSize = [
                        { label: "Panjang bahu", value: order.bahu },
                        { label: "Panjang Dada", value: order.dada },
                        { label: "Panjang Tangan", value: order.panjang_tangan },
                        { label: "Panjang Badan", value: order.panjang_badan },
                        { label: "Lebar Tangan", value: order.lebar_tangan },
                        { label: "Lebar Depan", value: order.lebar_depan },
                        { label: "Lebar Belakang", value: order.lebar_belakang },
                        { label: "Lebar Pinggang", value: order.lebar_pinggang },
                        { label: "Lebar Pinggul", value: order.lebar_pinggul },
                      ];
                      setSize(dataSize);
                      setShowModal(true);
                    }}
                    title="Size Description"
                  >
                    <RxRulerSquare />
                  </button>
                </td>
                <td className="px-6 py-4">{order.description}</td>
                {/* <td className="px-6 py-4">{order.user.no_whatsapp}</td> */}
                <td className="px-6 py-4">{formatRupiah(order.price.toString())}</td>
                <td className="px-6 py-4">
                  <p>{moment(order.deadline).format("dddd, DD/MM/YYYY")}</p>
                  <CountdownTimer targetDate={moment(order.deadline)} />
                </td>
                <td className="px-6 py-4 font-bold">{order.status.toUpperCase()}</td>
                {role === "admin" && (
                  <td id="actionCell" className="flex flex-col gap-4 px-6 py-4 text-sm md:text-md">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href={"order/edit/" + order.id}
                        title="Edit Order"
                        className=" text-white bg-yellow-400 hover:bg-yellow-200 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-bold rounded-full  px-5 py-2.5 text-center "
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className=" text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full  px-5 py-2.5 text-center"
                        onClick={handleShowModal.bind(this, order.id)}
                        title="Delete Order"
                      >
                        <FaTrashAlt />
                      </button>
                      <button
                        title="Done Order"
                        onClick={handleDone.bind(this, order.id)}
                        className=" text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full  px-5 py-2.5 text-center  "
                      >
                        <MdOutlineDoneOutline />
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        title="See Image "
                        type="button"
                        className="  text-white bg-blue-500 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full  px-5 py-2.5 text-center "
                        onClick={handlePopUp.bind(this, process.env.NEXT_PUBLIC_API + order.image)}
                      >
                        <FaImage />
                      </button>
                      <Link
                        title="See Invoice"
                        className="border  text-gray-900 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full  px-5 py-2.5 text-center"
                        href={"invoice/" + order.id}
                      >
                        <LiaFileInvoiceDollarSolid />
                      </Link>
                      <button
                        title="Send Invoice"
                        className="border  text-gray-900 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full  px-5 py-2.5 text-center"
                        onClick={handleSendInvoice.bind(this, {
                          invoiceId: order.id,
                          name: order.user.name,
                          no_whatsapp: order.user.no_whatsapp,
                          status: order.status,
                        })}
                      >
                        <RiMailSendLine />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination length={length} onClick={setSelectPage} selectPage={selectPage} />
    </div>
  );
};

export default OrderComponent;
