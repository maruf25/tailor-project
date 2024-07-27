"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/providers/AuthContext";
import { ToastContainer } from "react-toastify";
import useToast from "@/hooks/useToast";
import { LoadingSpinner } from "@/components/UI/loadingSpinner";

const formOrder = ({ isUpdate, customerId }) => {
  const { token } = useAuthContext();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [noWhatsapp, setNoWhatsapp] = useState("62");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [errorWhatsapp, setErrorWhatsapp] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const { notify } = useToast();

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API + "customer/" + customerId, {
          withCredentials: true,
        });

        const resData = await response.data.customer;

        setName(resData.name);
        setUsername(resData.username);
        setNoWhatsapp(resData.no_whatsapp);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            router.push("/login");
          }
          notify("error", error.response.data.message);
        } else if (error.request) {
          console.error("No response received from server. It might be down.");
          notify("error", "Cannot connect to the server. It might be down.");
        }
      }
    };

    if (isUpdate) {
      fetchData();
    }
  }, [isUpdate, customerId, token]);

  const inputName = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setName(value);
    }
  };

  const inputNoWhatsapp = (e) => {
    let value = e.target.value;

    if (!value.startsWith("62")) {
      value = "62" + value;
    }

    if (Number(value) < 1 || value.toString().length < 13 || value.toString().length > 15) {
      setErrorWhatsapp("Number min 13 and max length 15 numbers");
    } else {
      setErrorWhatsapp("");
    }
    setNoWhatsapp(value);
  };

  const handlePassword = (e) => {
    setConfPassword(e.target.value);
    if (password.length < 5) {
      setErrorPassword("password min length 5");
    } else if (password !== e.target.value) {
      setErrorPassword("password doesn't match");
    } else {
      setErrorPassword("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      name,
      username,
      no_whatsapp: noWhatsapp,
    };

    if (isUpdate) {
      data = {
        ...data,
        password: password,
        confirmPassword: confPassword,
      };
    }

    try {
      setLoading(true);
      let response;
      if (isUpdate) {
        response = await axios.put(process.env.NEXT_PUBLIC_API + "customer/" + customerId, data, {
          withCredentials: true,
        });
      } else {
        response = await axios.post(process.env.NEXT_PUBLIC_API + "customer", data, {
          withCredentials: true,
        });
      }
      const resData = await response.data;
      notify("success", "Success create customer!", 4000, false);
      setTimeout(() => {
        router.push("/dashboard/customer");
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
        notify("error", "Failed, try again!", 4000);
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        notify("error", "Cannot connect to the server. It might be down.");
      }
      setError("Failed , try again!");
      // console.log(error.response.data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
      <h2 className="mb-4 text-xl font-bold text-gray-900 ">
        {isUpdate ? "Update a customer" : "Add a new customer"}
      </h2>
      <ToastContainer />
      {loading && <LoadingSpinner />}
      {error !== "" && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">
              username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="username"
              required
            />
            {errors.username && <p className="text-red-600">{errors.username}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">
              Customer Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={inputName}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="John Doe"
              required
            />
            {errors.name && <p className="text-red-600">{errors.name}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="no_whatsapp" className="block mb-2 text-sm font-medium text-gray-900 ">
              No Whatsapp
            </label>
            <input
              type="number"
              name="no_whatsapp"
              id="no_whatsapp"
              value={noWhatsapp}
              onChange={inputNoWhatsapp}
              minLength={12}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="081234567812"
              required
            />
            {errorWhatsapp !== "" && <p className="text-sm italic text-red-600">{errorWhatsapp}</p>}
          </div>
          {isUpdate && (
            <>
              <div className="sm:col-span-2">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="*****"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="confPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confPassword"
                  id="confPassword"
                  value={confPassword}
                  onChange={handlePassword}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="*****"
                />
                {errorPassword !== "" && (
                  <p className="text-sm italic text-red-600">{errorPassword}</p>
                )}
              </div>
            </>
          )}
        </div>
        <button
          type="submit"
          className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
        >
          {isUpdate ? "Update customer" : "Add customer"}
        </button>
      </form>
    </div>
  );
};

export default formOrder;
