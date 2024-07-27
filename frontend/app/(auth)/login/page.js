import React from "react";

import LoginComponent from "@/components/auth/login";

export const metadata = {
  title: "Login",
  description: "created for login admin",
};

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen p-4 md:p-0">
      <img
        className="absolute object-cover w-full h-screen -z-20"
        src="https://images.unsplash.com/photo-1707247405560-04e5751beb5d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="login img"
      />
      <div className="absolute inset-0 bg-black opacity-5 -z-10"></div>
      <LoginComponent />
    </div>
  );
};

export default LoginPage;
