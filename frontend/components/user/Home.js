"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const Home = () => {
  const text =
    "Kami hadir untuk Anda setiap saat, memberikan layanan jahitan berkualitas tinggi. Dengan ahli jahit yang berpengalaman, kami siap menjawab kebutuhan fashion Anda dan menyediakan solusi yang penuh perhatian. Percayakan pada kami untuk memberikan sentuhan kreatif pada setiap potongan kain, mewujudkan pakaian yang tidak hanya elegan tetapi juga mencerminkan kepribadian unik Anda. Fashion tanpa batas, kualitas tanpa kompromi - kami siap memberikan yang terbaik untuk Anda.".split(
      " "
    );
  const message = encodeURI("hallo min, saya ingin melakukan pemesanan");
  const variants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative ml-2 mr-2" id="home">
      <img
        className="w-full h-[50vh]  lg:h-[100vh] object-cover rounded-md"
        src="https://plus.unsplash.com/premium_photo-1676586308760-e6491557432f?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="heroBanner"
      />
      <div className="absolute w-full h-full space-y-6 text-4xl text-center text-white transform -translate-x-1/2 -translate-y-1/2 rounded-md top-1/2 left-1/2 bg-black/40"></div>
      <div className="absolute w-full text-xs text-center text-white transform -translate-x-1/2 -translate-y-1/2 md:space-y-6 md:w-1/2 md:text-4xl top-1/2 left-1/2">
        <motion.h1
          className="font-bold whitespace-nowrap"
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          Selamat datang di Emi Tailor
        </motion.h1>
        <motion.p
          className="p-6 text-xs md:text-lg md:p-0"
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          {text.map((value, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: i / 10,
              }}
              key={i}
            >
              {value}{" "}
            </motion.span>
          ))}
        </motion.p>
        {/* <motion.p
          className="p-6 text-xs md:text-base md:p-0"
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          {text}
        </motion.p> */}
        <motion.div
          className="flex text-sm md:text-xl"
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_NOWA}?text=${message}`}
            target="_blank"
            className="flex items-center justify-center w-[120px] h-[50px] md:w-[200px] md:h-full p-4 mx-auto border border-white rounded-md cursor-pointer whitespace-nowrap hover:border-solid"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Pesan sekarang
          </motion.a>
          {/* <Link
            href={""}
            className="flex items-center justify-center mx-auto border border-white w-[200px] p-4 rounded-md"
          >
            Order Now
          </Link> */}
          {/* <Link
            href={""}
            className="flex items-center justify-center mx-auto bg-green-500 w-[200px] p-4 rounded-md"
          >
            Lihat Orderan
          </Link> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
