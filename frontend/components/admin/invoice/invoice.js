"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { useParams, useRouter } from "next/navigation";

import Image from "next/image";
import Logo from "../../../public/Logo.png";
import WatermarkInvoice from "@/public/watermarkInvoice.png";
import { useAuthContext } from "@/providers/AuthContext";
import { formatRupiah } from "@/utils/formatRupiah";

const invoice = () => {
  const { invoiceId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState({});
  const [price, setPrice] = useState("");
  const { token } = useAuthContext();

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API + "transactions/" + invoiceId, {
        withCredentials: true,
      });

      const resData = await response.data.transaction;

      const formatedPrice = formatRupiah(resData.price.toString());

      setOrder(resData);
      setPrice(formatedPrice);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
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
    fetchData();
  }, [token]);

  return (
    <div id="invoicePage" className="max-w-[750px] min-h-[700px] text-black">
      {Object.keys(order).length !== 0 && (
        <>
          <Image priority={true} className="absolute min-h-[700px]" src={WatermarkInvoice} alt="" />
          <div className="max-w-[750px] min-h-[700px] relative z-10">
            {/* <!-- Header --> */}
            <div className="h-[150px] bg-[#F4F5F7] flex justify-between items-center p-6">
              <Image priority={true} src={Logo} className="w-[150px]" alt="" />
              <p className="text-xl font-bold">#{order.name}</p>
            </div>
            {/* <!-- Title --> */}
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-3xl font-bold">
              <p>Pesanan {order.status}</p>
              <p className="text-base font-normal text-[#7C7C7C]">
                {moment(order?.updatedAt).format("DD MMMM YYYY HH:mm:ss")} WIB
              </p>
              <p>{price}</p>
            </div>
            {/* <!-- Body --> */}
            <div className="min-h-[300px] font-semibold border border-y-4 border-x-0 border-dotted border-black text-2xl flex flex-col justify-center">
              <div className="flex justify-between p-6">
                <p>Customer</p>
                <p>{order.user?.name}</p>
              </div>
              <div className="flex justify-between p-6">
                <p>No Whatsapp</p>
                <p>{order.user?.no_whatsapp}</p>
              </div>
            </div>
            {/* <!-- Footer --> */}
            <div className="h-[82px] justify-center text-center inline-flex w-full items-center font-bold text-2xl">
              <p>Terimakasih Atas kepercayaanya 🙏</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default invoice;
