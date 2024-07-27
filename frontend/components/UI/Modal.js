"use client";
import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const Backdrop = (props) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-[100vh] z-40 bg-black bg-opacity-75"
      onClick={props.onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

const ModalOverlay = (props) => {
  return (
    <motion.div
      className="fixed z-50 p-8 transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 top-1/2 left-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        className="w-16 h-16 mx-auto mb-4 text-gray-900 "
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <p className="mb-6 text-gray-900">
        Are you sure you want to {props.title || "delete"} this product?
      </p>
      <div className="flex justify-center gap-8">
        <button
          className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
          onClick={props.onConfirm}
        >
          Delete
        </button>
        <button
          className="px-4 py-2 mr-2 text-gray-900 border border-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900"
          onClick={props.onCancel}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

const Modal = (props) => {
  const portalElement = document.getElementById("overlays");

  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={props.onShow} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay onCancel={props.onShow} onConfirm={props.onConfirm} title={props.title} />,
        portalElement
      )}
    </>
  );
};

export default Modal;
