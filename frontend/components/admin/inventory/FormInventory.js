"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthContext";

import { ToastContainer } from "react-toastify";
import useToast from "@/hooks/useToast";

const FormInventory = ({ isUpdate, inventoryId }) => {
  const { token } = useAuthContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const regex = /kain/i;

  const { notify } = useToast();

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API + "inventories/" + inventoryId,
          {
            withCredentials: true,
          }
        );

        const resData = await response.data.inventory;

        setName(resData.name);
        setDescription(resData.description);
        setQuantity(resData.quantity);
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

    if (isUpdate) {
      fetchData();
    }
  }, [isUpdate, inventoryId, token]);

  const inputQuantity = (e) => {
    const value = e.target.value;

    if (value < 0) {
      setQuantity(0);
      return;
    }

    setQuantity(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      name,
      quantity,
      description,
    };

    try {
      let response;
      if (isUpdate) {
        response = await axios.put(
          process.env.NEXT_PUBLIC_API + "inventories/" + inventoryId,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(process.env.NEXT_PUBLIC_API + "inventories", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      }

      const resData = await response.data;
      notify("success", "Success!", 4000, false);
      setTimeout(() => {
        router.push("/dashboard/inventory");
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
        notify("error", "Failed!", 4000);
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
      setError("Failed, try again!");
      // console.log(error);
    }
  };

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
      <h2 className="mb-4 text-xl font-bold text-gray-900 ">
        {isUpdate ? "Update a inventory" : "Add a new inventory"}
      </h2>
      <ToastContainer />
      {error !== "" && <p className="text-red-600">ERROR {error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">
              Name Product
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Kain batik 50m"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>
          {/* <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Image
            </label>
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              {image ? (
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <img
                    className="w-full h-[225px] object-cover"
                    src={image}
                    alt="upload spending image"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPG OR PNG</p>
                </div>
              )}
              <input
                ref={imageRef}
                id="dropzone-file"
                type="file"
                name="images"
                className="hidden"
                onChange={imagePreview}
              />
            </label>
          </div> */}
          <div className="mb-3">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 ">
              Description
            </label>
            <textarea
              type="text"
              id="description"
              name="description"
              placeholder="New Item"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            {errors.description && <p className="text-red-600">{errors.description}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 ">
              Quantity ({regex.test(name) ? "m" : "pcs"})
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min={0}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              value={quantity}
              onChange={inputQuantity}
              required
            />
            {errors.quantity && <p className="text-red-600">{errors.quantity}</p>}
          </div>
        </div>
        <button
          type="submit"
          className={
            "mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
          }
        >
          {isUpdate ? "Update product" : "Add product"}
        </button>
      </form>
    </div>
  );
};

export default FormInventory;
