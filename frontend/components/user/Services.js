"use client";
import React from "react";
import { motion } from "framer-motion";

const ServicesComponent = () => {
  const services = [
    {
      title: "Jahitan Pakaian",
      description:
        "pembuatan pakaian sesuai dengan keinginanan, pembuatan pakaian seragam, pembuatan pakaian untuk acara khusus",
      image:
        "https://plus.unsplash.com/premium_photo-1683121874142-1de003f138a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Perbaikan Pakaian",
      description:
        "perubahan pakaian yang sudah ada, seperti memendekkan celana, mengecilkan pakaian, dan sebagainya",
      image:
        "https://images.unsplash.com/photo-1633655442356-ab2dbc69c772?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Pengukuran",
      description:
        "mengambil ukuran tubuh pelanggan untuk memastikan pakaian yang dibuat pas dan nyaman",
      image:
        "https://images.unsplash.com/photo-1611077544637-f826625c2776?q=80&w=1880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <motion.div
      className="text-center text-black lg:h-[100vh] flex flex-col items-center justify-center p-6"
      id="services"
    >
      <motion.h1
        className="text-xl font-bold md:text-3xl"
        initial="hidden"
        whileInView="visible"
        variants={variants}
      >
        Layanan
      </motion.h1>
      <div className="flex items-center justify-center h-4 bg-white decoration">
        <div className="line w-6 h-0.5 md:w-10 bg-black"></div>
        <div className="w-3 h-3 bg-black rounded-full circle"></div>
        <div className="line w-6 h-0.5 md:w-10 bg-black"></div>
      </div>
      <motion.div
        className="flex flex-col gap-5 p-6 text-black md:flex-row lg:p-10 lg:gap-10 "
        initial="hidden"
        whileInView="visible"
        variants={variants}
      >
        {services.map((service, key) => (
          <motion.div
            key={key}
            className="overflow-hidden shadow-lg lg:max-w-sm rounded-tr-2xl rounded-bl-2xl"
            variants={itemVariants}
          >
            <img
              className="w-full h-[100px] md:h-[150px] lg:h-[250px] object-cover"
              src={service.image}
              alt="service image"
            />
            <div className="flex items-center justify-center w-full h-4 p-4 mx-auto decoration">
              <div className="w-1/2 h-0.5 bg-black"></div>
            </div>
            <div className="p-2 md:py-4 md:px-6">
              <div className="mb-2 text-sm font-bold md:text-xl">{service.title}</div>
              <p className="text-xs text-gray-700 md:text-base">{service.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ServicesComponent;
