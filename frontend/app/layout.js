import { Poppins } from "next/font/google";

import "./globals.css";
import { AuthContextProvider } from "@/providers/AuthContext";
import { ToastContainer } from "react-toastify";
import { cookies } from "next/headers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Next App",
  description: "Next App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div id="overlays"></div>
        <AuthContextProvider token={cookies().get("token")}>
          <ToastContainer />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
