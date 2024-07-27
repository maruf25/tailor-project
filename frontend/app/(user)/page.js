import React from "react";

import HomeComponent from "@/components/user/Home";
import AboutComponent from "@/components/user/About";
import ServicesComponent from "@/components/user/Services";
import Order from "@/components/user/Order";
import ScrollOnTop from "@/components/UI/ScrollOnTop";

export const metadata = {
  title: "Home",
  description: "created for home user",
};

const HomePage = () => {
  return (
    <div className="bg-white">
      <ScrollOnTop />
      <HomeComponent />
      {/* <Order /> */}
      <ServicesComponent />
      <AboutComponent />
    </div>
  );
};

export default HomePage;
