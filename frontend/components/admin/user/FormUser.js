"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthContext";

const FormUser = ({ isUpdate, userId }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const [passwordMatch, setPasswordMatch] = useState("");

  const [error, setError] = useState([]);

  const { token } = useAuthContext();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API + "users/" + userId, {
          withCredentials: true,
        });

        const resData = await response.data.user;

        setName(resData.name);
        setUsername(resData.username);
      } catch (error) {
        console.log(error);
      }
    };

    if (isUpdate) {
      fetchData();
    }
  }, [isUpdate, userId, token]);

  const inputConfirmPassword = (e) => {
    const value = e.target.value;
    setPasswordMatch("");
    if (value !== password) {
      setPasswordMatch("Password doesn't match");
    }
    setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      name,
      username,
      password,
    };
    try {
      let response;
      if (isUpdate) {
        data.confirmPassword = confirmPassword;
        response = await axios.put(process.env.NEXT_PUBLIC_API + "users/" + userId, data, {
          withCredentials: true,
        });
      } else {
        response = await axios.post(process.env.NEXT_PUBLIC_API + "auth/signup", data, {
          withCredentials: true,
        });
      }
      const resData = await response.data;
      console.log(resData);
      //   Sementara ketika sukses
      router.push("/dashboard/user");
    } catch (error) {
      setError(error.response.data.data);
    }
  };

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        {isUpdate ? "Update a user" : "Add a new user"}
      </h2>
      {error.length !== 0 &&
        error.map((data) => (
          <p key={data.path} className="italic text-red-400">
            {data.msg}
          </p>
        ))}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 ">
          <div className="w-full">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="Admin"
              required
            />
          </div>
          <div className="w-full">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">
              Username
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
          </div>
          <div className="w-full">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              minLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="*****"
            />
          </div>
          <div className="w-full">
            <label htmlFor="confPassword" className="block mb-2 text-sm font-medium text-gray-900 ">
              Confirm Password
            </label>
            <input
              type="password"
              name="confPassword"
              id="confPassword"
              value={confirmPassword}
              onChange={inputConfirmPassword}
              minLength={5}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="*****"
            />
            {passwordMatch && <p className="italic text-red-400">{passwordMatch}</p>}
          </div>
        </div>
        <button
          type="submit"
          className={
            passwordMatch
              ? "cursor-not-allowed mt-5 bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              : "mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none "
          }
        >
          {isUpdate ? "Update user" : "Add user"}
        </button>
      </form>
    </div>
  );
};

export default FormUser;
