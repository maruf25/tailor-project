"use client";
import { useAuthContext } from "@/providers/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../UI/loadingSpinner";

const LoginComponent = () => {
  const ctx = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (ctx.token) {
      router.push("/dashboard");
    }
  }, [router, ctx.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    ctx.onLogin(usernameRef.current.value, passwordRef.current.value);
  };

  return (
    <div className="max-w-md w-full justify-center p-4 border border-gray-200 rounded-lg  sm:p-6 md:p-8 bg-white  shadow-[10px_10px_0px_rgba(249,250,251,1)]">
      {ctx.loading && <LoadingSpinner />}
      {ctx.error && <p className="text-center text-red-500">Email or password not valid</p>}
      <div className="p-4 ">
        <h5 className="text-xl font-bold text-center text-gray-900">LOGIN</h5>
        <div className="flex items-center justify-center h-4 decoration">
          <div className="line w-2 h-0.5 md:w-10 bg-black"></div>
          <div className="w-3 h-3 bg-black rounded-full circle"></div>
          <div className="line w-2 h-0.5 md:w-10 bg-black"></div>
        </div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="w-full">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">
            Username anda
          </label>
          <input
            ref={usernameRef}
            type="text"
            name="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   "
            placeholder="username"
            required
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">
            Password anda
          </label>
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="••••••••"
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-0 right-0 flex items-center justify-center text-sm text-gray-900 cursor-pointer"
          >
            {showPassword ? (
              <svg
                className="w-6 h-6 text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
      </form>
      <p className="mt-3 text-sm italic font-light text-center text-gray-900">
        lupa password ?{" "}
        <a
          className="text-blue-600"
          href={`https://wa.me/${process.env.NEXT_PUBLIC_NOWA}?text=${encodeURI(
            "hallo min, saya lupa password"
          )}`}
          target="_blank"
        >
          hubungi admin
        </a>
      </p>
    </div>
  );
};

export default LoginComponent;
