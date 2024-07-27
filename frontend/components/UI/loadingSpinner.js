"use client";
import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const Backdrop = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 z-40 w-full h-full bg-black bg-opacity-75"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

const SpinnerLoading = () => {
  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };
  return (
    <div className="fixed z-50 p-8 transform -translate-x-1/2 -translate-y-1/2 rounded-lg top-1/2 left-1/2">
      <motion.div
        variants={spinnerVariants}
        animate="spin"
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid rgba(255, 255, 255, 0.1)",
          borderTop: "5px solid #fff",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </div>
  );
};

export const LoadingBasic = () => {
  return (
    <>
      <Backdrop />
      <SpinnerLoading />
    </>
  );
};

export const LoadingSpinner = () => {
  const portalElement = document.getElementById("overlays");

  return (
    <>
      {ReactDOM.createPortal(<Backdrop />, portalElement)}
      {ReactDOM.createPortal(<SpinnerLoading />, portalElement)}
    </>
  );
};
