import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import CountdownTimer from "@/utils/CountdownTimer";

const RecentOrder = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API + "orders?recent=true", {
        withCredentials: true,
      });
      const resData = await response.data.transactions;

      setOrders(resData.rows);
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
    getOrders();
  }, []);

  return (
    <div className="text-gray-900">
      <h1 className="mt-5 text-xl font-bold">Recent Order</h1>
      <div className="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 rtl:text-right ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Size (CM)
              </th> */}
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Deadline
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr className="bg-white border-b ">
                <td
                  scope="row"
                  colSpan={5}
                  className="px-6 py-4 font-medium text-center text-gray-900 "
                >
                  No Product Found
                </td>
              </tr>
            )}
            {orders.map((order, key) => (
              <tr className="bg-white border-b " key={key}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 ">
                  ({order.user.name}) {order.name}
                </th>
                {/* <td className="px-6 py-4">
                  <img
                    src={process.env.NEXT_PUBLIC_API + order.image}
                    alt="image"
                    className="h-[200px] w-[200px] object-contain"
                  />
                </td> */}
                {/* <td className="px-6 py-4 ">
                  <ul className="text-right whitespace-nowrap">
                    <li>bahu: {order.bahu}</li>
                    <li>dada: {order.dada}</li>
                    <li>pt: {order.panjang_tangan}</li>
                    <li>pb: {order.panjang_badan}</li>
                    <li>lt: {order.lebar_tangan}</li>
                    <li>ld: {order.lebar_depan}</li>
                    <li>lb: {order.lebar_belakang}</li>
                    <li>lpgang: {order.lebar_pinggang}</li>
                    <li>lpgul: {order.lebar_pinggul}</li>
                  </ul>
                </td> */}
                <td className="px-6 py-4">{order.description}</td>
                <td className="px-6 py-4 font-bold">{order.status.toUpperCase()}</td>
                <td className="px-6 py-4">
                  <p>{moment(order.deadline).format("dddd, DD/MM/YYYY")}</p>
                  <CountdownTimer targetDate={moment(order.deadline)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrder;
