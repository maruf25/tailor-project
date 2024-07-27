"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-[100vh] z-40 bg-black bg-opacity-75"
      onClick={props.onClick}
    />
  );
};

const ModalOverlay = (props) => {
  return (
    <div className="fixed z-50 w-full p-8 transform -translate-x-1/2 -translate-y-1/2 rounded-lg top-1/2 left-1/2 md:w-auto">
      <div className="p-8 bg-white rounded-lg shadow-xl ">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-black">{props.title}</h2>
          <button onClick={props.onCancel} className="text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4 mb-6 text-black">{props.children}</div>
        <div className="flex justify-center gap-8">
          <button
            className="px-4 py-2 mr-2 text-gray-900 border border-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900"
            onClick={props.onCancel}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = (props) => {
  const portalElement = document.getElementById("overlays");

  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={props.onShow} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay onCancel={props.onShow} onConfirm={props.onConfirm} title={props.title}>
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
