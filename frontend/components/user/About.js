"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

import CustomModal from "../UI/CustomModal";

const About = () => {
  const [buttonHover, setButtonHover] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const datas = [
    {
      image:
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Funblast.com%2Fwp-content%2Fuploads%2F2020%2F09%2FTailor-Vector-Illustration.jpg&f=1&nofb=1&ipt=a05278a9f401b3782afbae1367ddb9b174d725db82fed1735236fee6c5a63fc0&ipo=images",
      text: "Jahitan apapun yang kamu mau, kami siap membantu kamu mewujudkan",
    },
    {
      image:
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Funblast.com%2Fwp-content%2Fuploads%2F2020%2F09%2FTailor-Vector-Illustration.jpg&f=1&nofb=1&ipt=a05278a9f401b3782afbae1367ddb9b174d725db82fed1735236fee6c5a63fc0&ipo=images",
      text: "Berkomitmen untuk selalu menjaga kualitas dengan hasil yang terbaik",
    },
    {
      image:
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Funblast.com%2Fwp-content%2Fuploads%2F2020%2F09%2FTailor-Vector-Illustration.jpg&f=1&nofb=1&ipt=a05278a9f401b3782afbae1367ddb9b174d725db82fed1735236fee6c5a63fc0&ipo=images",
      text: "Kesempurnaan dalam setiap jahitan dengan memperhatikan detail",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <div className="lg:grid grid-cols-2 gap-8 p-6 lg:p-10 text-black lg:h-[100vh]" id="about">
      {showModal && (
        <CustomModal onShow={() => setShowModal(false)} title="Cara Order">
          <motion.ol
            variants={containerVariants}
            initial={"hidden"}
            whileInView={"visible"}
            className="list-decimal"
          >
            <motion.li variants={itemVariants}>
              Konsultasikan kebutuhan anda melalui whatsapp
            </motion.li>
            <motion.li variants={itemVariants}>
              Datang ke tempat kami untuk melakukan pengukuran dan diskusi terkait jahitan yang anda
              inginkan
            </motion.li>
            <motion.li variants={itemVariants}>
              Lacak orderan anda melalui website kami dengan melakukan login sesuai akun anda yang
              telah diberikan
            </motion.li>
          </motion.ol>
        </CustomModal>
      )}
      <div className="hidden space-y-4 lg:block lg:p-5">
        <motion.img
          className="lg:h-[400px] w-full object-cover rounded-lg"
          src="https://images.unsplash.com/photo-1613076321656-23dcdd3aea92?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="about pict 1"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        />
        <div className="grid grid-cols-2 gap-4">
          <motion.img
            className="lg:h-[200px] w-full object-cover rounded-lg"
            src="https://images.unsplash.com/photo-1536866466683-719c280a6944?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="about pict 2"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          />
          <motion.img
            className="lg:h-[200px] w-full object-cover rounded-lg"
            src="https://images.unsplash.com/photo-1536867520774-5b4f2628a69b?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="about pict 3"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </div>
      <div className="space-y-2 text-xs md:text-lg lg:p-5">
        <div className="flex items-center">
          <motion.h1
            className="text-xl font-bold text-center text-blue-500 lg:text-left md:text-3xl "
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
          >
            Tentang Kami
          </motion.h1>
          <motion.div
            className="flex items-center justify-center w-1/2 h-4 ml-3 bg-white decoration"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
          >
            <div className="line w-full h-0.5 bg-blue-500"></div>
            {/* <div className="w-8 h-4 bg-blue-500 rounded-full circle"></div> */}
            <div className="w-16 h-6 bg-blue-500 clip-path-star"></div>
            <div className="w-16 h-6 bg-blue-500 clip-path-star"></div>
            <div className="w-16 h-6 bg-blue-500 clip-path-star"></div>
            <div className="line w-full h-0.5 bg-blue-500"></div>
          </motion.div>
        </div>

        <motion.h1
          className="max-w-sm text-xl font-bold lg:text-2xl"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
        >
          Mewujudkan impian mode anda dengan jahitan yang detail ❤
        </motion.h1>
        <motion.img
          className="object-cover w-full rounded-lg lg:hidden"
          src="https://images.unsplash.com/photo-1613076321656-23dcdd3aea92?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="aboutPicture"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
        />
        <motion.p
          className="text-justify"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
        >
          Tailor project adalah ahli jahit yang berdidikasi untuk membuat pakaian yang tidak hanya
          nyaman dipakai, tetapi juga mencerminkan gaya dan kepribadian anda. Kami tidak hanya
          menyajikan pakaian, tetapi juga pengalaman yang penuh perhatian. Dari konsultasi hingga
          pemilihan bahan yang teliti, setiap langkah dalam proses jahitan kami kerjakan dengan
          cermat untuk memastikan bahwa setiap detail memenuhi standar kualitas tertinggi.
        </motion.p>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible">
          {datas.map((item, index) => (
            <motion.div
              className="flex items-center gap-2 space-y-2"
              variants={itemVariants}
              key={index}
            >
              <img className="object-cover h-14 w-14" src={item.image} alt="about pict" />
              <p>{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className="flex items-center justify-center p-2 border-2 border-black rounded-md w-full lg:w-[200px]"
          onHoverEnd={() => setButtonHover(false)}
          onHoverStart={() => setButtonHover(true)}
          whileHover={{ scale: 1, fontWeight: "bold" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowModal(true)}
        >
          Cara Order
          <motion.svg
            // width="16"
            // height="16"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{
              width: "16px",
            }}
            animate={{
              marginLeft: buttonHover ? "10px" : "2px",
              width: buttonHover ? "24px" : "16px",
            }}
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </motion.svg>
        </motion.button>
        {/* <Link
          href=""
          className="flex justify-center p-2 border-2 border-black rounded-md w-[200px] hover:font-bold"
        >
          <motion.span whileHover={{ scale: 1.1 }}>
            Cara Order
            <svg
              width="16"
              height="16"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </motion.span>
        </Link> */}
      </div>
    </div>
  );
};

export default About;
