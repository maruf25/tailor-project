"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "../public/Logo.png";
import { useAuthContext } from "@/providers/AuthContext";

const Backdrop = (props) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-[100vh] z-20 bg-black bg-opacity-75"
      onClick={props.onClick}
    />
  );
};

const navbar = () => {
  // const message = encodeURI("hallo min, saya ingin melakukan pemesanan");
  const [showNavMobile, setShowNavMobile] = useState(false);
  const { token } = useAuthContext();

  return (
    <>
      {showNavMobile &&
        ReactDOM.createPortal(
          <Backdrop onClick={() => setShowNavMobile(!showNavMobile)} />,
          document.getElementById("overlays")
        )}
      <nav className="flex justify-between text-black bg-white md:grid-cols-4 md:grid ">
        <div className="flex items-center justify-center border-2 border-transparent md:border-r-black">
          <Image
            src={Logo}
            className="w-[70px] h-[50px] md:w-[100px] md:h-[100px]"
            priority={true}
            alt="Logo Bisnis"
          />
        </div>
        <button
          onClick={() => setShowNavMobile(!showNavMobile)}
          type="button"
          className="flex items-center justify-center w-10 text-sm text-center text-black rounded-lg md:hidden focus:outline-none "
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`fixed top-0 right-0 z-30 p-4 w-full transition-transform flex flex-col items-center space-y-4 md:space-y-0 justify-center md:p-4 text-sm text-center border-2 border-transparent md:flex-row md:col-span-2 md:text-lg md:space-x-10 md:border-r-black md:w-auto md:flex bg-white md:static ${
            showNavMobile ? "translate-y-0" : "-translate-y-96"
          } sm:translate-y-0`}
        >
          <Link href="#home" className="hover:font-bold" onClick={() => setShowNavMobile(false)}>
            Beranda
          </Link>
          {/* <Link href="#order" className="hover:font-bold" onClick={() => setShowNavMobile(false)}>
            Order
          </Link> */}
          <Link
            href="#services"
            className="hover:font-bold"
            onClick={() => setShowNavMobile(false)}
          >
            Layanan
          </Link>
          <Link href="#about" className="hover:font-bold" onClick={() => setShowNavMobile(false)}>
            Tentang
          </Link>
          <Link
            href={token ? `/dashboard` : "/login"}
            className="flex p-2 border-2 border-black hover:font-bold md:hidden"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                clipRule="evenodd"
              />
            </svg>
            {token ? "Dashboard" : "Masuk"}
          </Link>
        </div>
        <div className="hidden md:flex items-center justify-center mx-auto text-center md:mr-4 w-[50px] md:w-full text-sm whitespace-nowrap">
          <motion.a
            href={token ? `/dashboard` : "/login"}
            className="flex items-center p-2 border-2 border-black rounded-sm lg:p-4"
            whileHover={{ border: "3px solid black", scale: 1.1, fontWeight: "bold" }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                clipRule="evenodd"
              />
            </svg>
            {token ? "Dashboard" : "Masuk"}
          </motion.a>
        </div>
      </nav>
    </>
  );
};

export default navbar;
