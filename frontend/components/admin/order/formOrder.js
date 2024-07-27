"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";

import { formatRupiah } from "@/utils/formatRupiah";
import { useAuthContext } from "@/providers/AuthContext";

import SelectWithSearch from "@/components/UI/SelectWithSearch";
import { ToastContainer } from "react-toastify";
import useToast from "@/hooks/useToast";
import SelectOption from "@/components/UI/SelectOption";
import { LoadingSpinner } from "@/components/UI/loadingSpinner";

const formOrder = ({ isUpdate, orderId }) => {
  const { token } = useAuthContext();
  const [name, setName] = useState("");
  const imageRef = useRef();
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("Lengan Panjang");
  const datelineRef = useRef();
  const [bahu, setBahu] = useState(1);
  const [dada, setDada] = useState(1);
  const [panjangTangan, setPanjangTangan] = useState(1);
  const [panjangBadan, setPanjangBadan] = useState(1);
  const [lebarTangan, setLebarTangan] = useState(1);
  const [lebarDepan, setLebarDepan] = useState(1);
  const [lebarBelakang, setLebarBelakang] = useState(1);
  const [lebarPinggang, setLebarPinggang] = useState(1);
  const [lebarPinggul, setLebarPinggul] = useState(1);
  const [price, setPrice] = useState(formatRupiah("1"));
  const [selectCustomer, setSelectCustomer] = useState({});
  const [status, setStatus] = useState("proses");
  const [selectCustomerName, setSelectCustomerName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [errorPrice, setErrorPrice] = useState("");
  const { notify } = useToast();

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API + "transactions/" + orderId, {
          withCredentials: true,
        });

        const resData = await response.data.transaction;

        const formatedPrice = formatRupiah(resData.price.toString());

        setName(resData.name);
        setImage(process.env.NEXT_PUBLIC_API + resData.image);
        setDescription(resData.description);
        setStatus(resData.status);
        datelineRef.current.value = moment(resData.deadline).format("YYYY-MM-DD");
        setBahu(resData.bahu);
        setDada(resData.dada);
        setPanjangTangan(resData.panjang_tangan);
        setPanjangBadan(resData.panjang_badan);
        setLebarTangan(resData.lebar_tangan);
        setLebarDepan(resData.lebar_depan);
        setLebarBelakang(resData.lebar_belakang);
        setLebarPinggang(resData.lebar_pinggang);
        setLebarPinggul(resData.lebar_pinggul);
        setPrice(formatedPrice);
        setSelectCustomer(resData.user);
        setSelectCustomerName(resData.user.name);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            router.push("/login");
          } else if (error.response.status === 403) {
            router.push("/403");
          }
          notify("error", "Error fetch data");
        } else if (error.request) {
          console.error("No response received from server. It might be down.");
          notify("error", "Cannot connect to the server. It might be down.");
        }
      }
    };

    if (isUpdate) {
      fetchData();
    }
  }, [isUpdate, orderId, token]);

  const imagePreview = (e) => {
    const file = e.target.files[0];

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const inputPrice = (event) => {
    const rawValue = event.target.value;
    const cleanValue = rawValue.replace(/[^,\d]/g, "");

    setErrorPrice("");

    if (cleanValue === "" || cleanValue === "0" || cleanValue.replace(/0/g, "") === "") {
      setErrorPrice("Please enter a valid price");
      setPrice(formatRupiah(""));
      return;
    }

    const formattedValue = formatRupiah(cleanValue);
    setPrice(formattedValue);
  };

  const handleSelectCustomer = (customer) => {
    setSelectCustomer(customer);
  };

  const handleSelectStatus = (status) => {
    setStatus(status);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numberPrice = price.split(" ")[1].replace(/\./g, "");

    const notifMessage = isUpdate ? "update" : "create";

    let data = {
      name,
      image: imageRef.current.files[0],
      description,
      status,
      deadline: datelineRef.current.value,
      bahu: bahu,
      dada: dada,
      panjang_tangan: panjangTangan,
      panjang_badan: panjangBadan,
      lebar_tangan: lebarTangan,
      lebar_depan: lebarDepan,
      lebar_belakang: lebarBelakang,
      lebar_pinggang: lebarPinggang,
      lebar_pinggul: lebarPinggul,
      price: numberPrice,
      customerId: selectCustomer.id,
    };

    try {
      setLoading(true);
      let response;
      if (isUpdate) {
        if (!imageRef.current.files[0]) {
          data.image = image;
        }

        response = await axios.put(process.env.NEXT_PUBLIC_API + "transactions/" + orderId, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      } else {
        response = await axios.post(process.env.NEXT_PUBLIC_API + "transactions", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      }
      const resData = await response.data;
      notify("success", `Success ${notifMessage} order!`, 4000, false);
      //   Sementara ketika sukses
      setTimeout(() => {
        router.push("/dashboard/order");
      }, 5000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const { data } = error.response;
          const errorObj = data.data.reduce((acc, err) => {
            acc[err.path] = err.msg;
            return acc;
          }, {});
          setErrors(errorObj);
        }
        if (error.response.status === 401) {
          router.push("/login");
        }
        notify("error", `Failed ${notifMessage} order,try again!`, 4000);
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
      setError("Failed , try again!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
      <ToastContainer />
      {loading && <LoadingSpinner />}
      <h2 className="mb-4 text-xl font-bold text-gray-900 ">
        {isUpdate ? "Update a order" : "Add a new order"}
      </h2>
      {error !== "" && <p className="text-red-600">ERROR {error}</p>}
      <SelectWithSearch
        onSelectCustomer={handleSelectCustomer}
        selectCustomerName={selectCustomerName}
        setSelectCustomerName={setSelectCustomerName}
      />
      {errors.customerId && <p className="text-red-600">Please select a customer</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {Object.keys(selectCustomer).length !== 0 && (
            <>
              <div className="w-full">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={selectCustomer.name}
                  className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed "
                  placeholder="John Doe"
                  disabled
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="no_whatsapp"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  No Whatsapp
                </label>
                <input
                  type="number"
                  name="no_whatsapp"
                  id="no_whatsapp"
                  value={selectCustomer.no_whatsapp}
                  className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed "
                  placeholder="081234567812"
                  disabled
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={selectCustomer.username}
                  className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed "
                  placeholder="John Doe"
                  disabled
                />
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="Hem Batik Coklat"
              required
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 " htmlFor="images">
              Upload image
            </label>
            {image && (
              <img src={image} className="w-full h-[200px] object-cover" alt="Upload Image" />
            )}
            <input
              ref={imageRef}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              aria-describedby="image"
              id="images"
              onChange={imagePreview}
              accept="image/*"
              name="images"
              type="file"
            />
            {errors.image && <p className="text-red-600">{errors.image}</p>}
          </div>
          <div className={!isUpdate ? "sm:col-span-2" : ""}>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 ">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="8"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 "
              placeholder="Your description here"
              required
            ></textarea>
            {errors.description && <p className="text-red-600">{errors.description}</p>}
          </div>
          {isUpdate && (
            <div>
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 ">
                Status
              </label>
              <SelectOption
                onSelect={handleSelectStatus}
                state={status}
                options={["proses", "dapat diambil", "selesai"]}
              />
              {errors.status && <p className="text-red-600">{errors.status}</p>}
            </div>
          )}
          <div>
            <label htmlFor="bahu" className="block mb-2 text-sm font-medium text-gray-900 ">
              Bahu (Cm)
            </label>
            <input
              type="number"
              name="bahu"
              id="bahu"
              min="1"
              value={bahu}
              onChange={(e) => setBahu(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.bahu && <p className="text-red-600">{errors.bahu}</p>}
          </div>
          <div>
            <label htmlFor="dada" className="block mb-2 text-sm font-medium text-gray-900 ">
              Dada (Cm)
            </label>
            <input
              type="number"
              name="dada"
              id="dada"
              min="1"
              value={dada}
              onChange={(e) => setDada(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.dada && <p className="text-red-600">{errors.dada}</p>}
          </div>
          <div>
            <label
              htmlFor="panjangTangan"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Panjang Tangan (Cm)
            </label>
            <input
              type="number"
              name="panjangTangan"
              id="panjangTangan"
              min="1"
              value={panjangTangan}
              onChange={(e) => setPanjangTangan(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.panjang_tangan && <p className="text-red-600">{errors.panjang_tangan}</p>}
          </div>
          <div>
            <label htmlFor="panjangBadan" className="block mb-2 text-sm font-medium text-gray-900 ">
              Panjang Badan (Cm)
            </label>
            <input
              type="number"
              name="panjangBadan"
              id="panjangBadan"
              min="1"
              value={panjangBadan}
              onChange={(e) => setPanjangBadan(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.panjang_badan && <p className="text-red-600">{errors.panjang_badan}</p>}
          </div>
          <div>
            <label htmlFor="lebarTangan" className="block mb-2 text-sm font-medium text-gray-900 ">
              Lebar Tangan (Cm)
            </label>
            <input
              type="number"
              name="lebarTangan"
              id="lebarTangan"
              min="1"
              value={lebarTangan}
              onChange={(e) => setLebarTangan(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.lebar_tangan && <p className="text-red-600">{errors.lebar_tangan}</p>}
          </div>
          <div>
            <label htmlFor="lebarDepan" className="block mb-2 text-sm font-medium text-gray-900 ">
              Lebar Depan (Cm)
            </label>
            <input
              type="number"
              name="lebarDepan"
              id="lebarDepan"
              min="1"
              value={lebarDepan}
              onChange={(e) => setLebarDepan(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.lebar_depan && <p className="text-red-600">{errors.lebar_depan}</p>}
          </div>
          <div>
            <label
              htmlFor="lebarBelakang"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Lebar Belakang (Cm)
            </label>
            <input
              type="number"
              name="lebarBelakang"
              id="lebarBelakang"
              min="1"
              value={lebarBelakang}
              onChange={(e) => setLebarBelakang(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.lebar_belakang && <p className="text-red-600">{errors.lebar_belakang}</p>}
          </div>
          <div>
            <label
              htmlFor="lebarPinggang"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Lebar Pinggang (Cm)
            </label>
            <input
              type="number"
              name="lebarPinggang"
              id="lebarPinggang"
              min="1"
              value={lebarPinggang}
              onChange={(e) => setLebarPinggang(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.lebar_pinggang && <p className="text-red-600">{errors.lebar_pinggang}</p>}
          </div>
          <div>
            <label htmlFor="lebarPinggul" className="block mb-2 text-sm font-medium text-gray-900 ">
              Lebar Pinggul (Cm)
            </label>
            <input
              type="number"
              name="lebarPinggul"
              id="lebarPinggul"
              value={lebarPinggul}
              min="1"
              onChange={(e) => setLebarPinggul(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="12"
              required
            />
            {errors.lebar_pinggul && <p className="text-red-600">{errors.lebar_pinggul}</p>}
          </div>
          <div></div>
          <div className="w-full">
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 ">
              Price
            </label>
            <input
              type="text"
              name="price"
              id="price"
              min="1"
              value={price}
              onChange={inputPrice}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="Rp 50.000"
              required
            />
            {errorPrice && <p className="italic text-red-600">{errorPrice}</p>}
          </div>
          <div>
            <label htmlFor="dateline" className="block mb-2 text-sm font-medium text-gray-900 ">
              Deadline
            </label>
            <input
              ref={datelineRef}
              type="date"
              name="dateline"
              min={isUpdate ? false : moment().format("YYYY-MM-DD")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
        >
          {isUpdate ? "Update product" : "Add product"}
        </button>
      </form>
    </div>
  );
};

export default formOrder;
