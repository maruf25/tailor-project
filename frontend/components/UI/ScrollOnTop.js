"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

const ScrollOnTop = () => {
  const [scrollY, setScrollY] = useState(0);

  const onScroll = useCallback((event) => {
    const { pageYOffset, scrollY } = window;
    setScrollY(window.pageYOffset);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll, { passive: true });
    };
  }, []);

  const handleToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      className="fixed z-10 p-4 text-black bg-red-500 rounded-full cursor-pointer bottom-4 right-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollY > 100 ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleToTop}
    >
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
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
          d="m5 15 7-7 7 7"
        />
      </svg>
    </motion.div>
  );
};

export default ScrollOnTop;
