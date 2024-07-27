"use client";
import React from "react";
import { motion } from "framer-motion";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-[100vh] z-40 bg-black bg-opacity-75"
      onClick={props.onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 hidden lg:block">
        <p className="text-white cursor-pointer">Close</p>
      </div>
    </motion.div>
  );
};

const ImageComponent = (props) => {
  return (
    <motion.div
      className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-lg top-1/2 left-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img className="" src={props.image} alt="popup-image" />
    </motion.div>
  );
};

const PopUpImage = (props) => {
  const portalElement = document.getElementById("overlays");
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={props.onShow} />, portalElement)}
      {ReactDOM.createPortal(<ImageComponent image={props.image} />, portalElement)}
    </>
  );
};

export default PopUpImage;
