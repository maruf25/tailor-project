"use client";
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useAuthContext } from "@/providers/AuthContext";
import Logo from "@/public/Logo.png";

const Backdrop = (props) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-[100vh] z-20 bg-black bg-opacity-75"
      onClick={props.onClick}
    />
  );
};

const SidebarComponent = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();
  const ctx = useAuthContext();

  const classNameTabActive =
    "flex items-center p-2 text-gray-900 rounded-lg bg-gray-100 hover:bg-gray-100 group";
  const classNameTab = "flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 group";

  const handleLogout = () => {
    ctx.onLogout();
  };
  return (
    <>
      {showSidebar &&
        ReactDOM.createPortal(
          <Backdrop onClick={() => setShowSidebar(!showSidebar)} />,
          document.getElementById("overlays")
        )}
      <button
        type="button"
        className="inline-flex items-center p-2 mt-2 text-sm text-gray-500 rounded-lg ms-3 sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-30 w-64 h-full transition-transform overflow-auto ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col justify-between h-full px-3 py-4 overflow-y-auto bg-gray-50">
          <div>
            <a href="/dashboard" className="flex flex-col items-center ps-2.5 mb-5">
              <Image
                src={Logo}
                className="object-contain bg-white border-4 border-gray-100 rounded-full w-14 h-14 me-3 lg:h-24 lg:w-24"
                priority={true}
                alt="Logo bisnis"
              />
              {/* <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-6 me-3 sm:h-7"
                alt="Flowbite Logo"
              /> */}
              <span className="self-center text-xl font-semibold text-gray-900">{ctx.name}</span>
            </a>
            <ul className="space-y-2 font-medium">
              <li>
                <Link
                  href={"/dashboard"}
                  className={pathname === "/dashboard" ? classNameTabActive : classNameTab}
                  onClick={() => setShowSidebar(false)}
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </Link>
              </li>
              {ctx.role === "admin" && (
                <li>
                  <Link
                    href="/dashboard/customer"
                    className={
                      pathname.startsWith("/dashboard/customer") ? classNameTabActive : classNameTab
                    }
                    onClick={() => setShowSidebar(false)}
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Customer</span>
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/dashboard/order"
                  className={
                    pathname.startsWith("/dashboard/order") ? classNameTabActive : classNameTab
                  }
                  onClick={() => setShowSidebar(false)}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 21"
                  >
                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Order</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/transaction"
                  className={
                    pathname === "/dashboard/transaction" ? classNameTabActive : classNameTab
                  }
                  onClick={() => setShowSidebar(false)}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 14 20"
                  >
                    <path d="M13.383.076a1 1 0 0 0-1.09.217L11 1.586 9.707.293a1 1 0 0 0-1.414 0L7 1.586 5.707.293a1 1 0 0 0-1.414 0L3 1.586 1.707.293A1 1 0 0 0 0 1v18a1 1 0 0 0 1.707.707L3 18.414l1.293 1.293a1 1 0 0 0 1.414 0L7 18.414l1.293 1.293a1 1 0 0 0 1.414 0L11 18.414l1.293 1.293A1 1 0 0 0 14 19V1a1 1 0 0 0-.617-.924ZM10 15H4a1 1 0 1 1 0-2h6a1 1 0 0 1 0 2Zm0-4H4a1 1 0 1 1 0-2h6a1 1 0 1 1 0 2Zm0-4H4a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Transaction</span>
                </Link>
              </li>
              {ctx.role === "admin" && (
                <>
                  <li>
                    <Link
                      href="/dashboard/spending"
                      className={
                        pathname.startsWith("/dashboard/spending")
                          ? classNameTabActive
                          : classNameTab
                      }
                      onClick={() => setShowSidebar(false)}
                    >
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap">Spending</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/inventory"
                      className={
                        pathname.startsWith("/dashboard/inventory")
                          ? classNameTabActive
                          : classNameTab
                      }
                      onClick={() => setShowSidebar(false)}
                    >
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.876.517A1 1 0 0 0 17 0H3a1 1 0 0 0-.871.508C1.63 1.393 0 5.385 0 6.75a3.236 3.236 0 0 0 1 2.336V19a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.044a3.242 3.242 0 0 0 1-2.294c0-1.283-1.626-5.33-2.124-6.233ZM15.5 14.7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1-.8-.8v-2.4a.8.8 0 0 1 .8-.8h2.4a.8.8 0 0 1 .8.8v2.4ZM16.75 8a1.252 1.252 0 0 1-1.25-1.25 1 1 0 0 0-2 0 1.25 1.25 0 0 1-2.5 0 1 1 0 0 0-2 0 1.25 1.25 0 0 1-2.5 0 1 1 0 0 0-2 0A1.252 1.252 0 0 1 3.25 8 1.266 1.266 0 0 1 2 6.75C2.306 5.1 2.841 3.501 3.591 2H16.4A19.015 19.015 0 0 1 18 6.75 1.337 1.337 0 0 1 16.75 8Z" />
                      </svg>
                      <span className="flex-1 ms-3 whitespace-nowrap">Inventory</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/recap"
                      className={
                        pathname.startsWith("/dashboard/recap") ? classNameTabActive : classNameTab
                      }
                      onClick={() => setShowSidebar(false)}
                    >
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span className="flex-1 ms-3 whitespace-nowrap">Rekap</span>
                    </Link>
                  </li>
                </>
              )}
              {/* <li>
                <Link
                  href="/dashboard/user"
                  className={pathname.startsWith("/dashboard/user") ? classNameTabActive : classNameTab}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                </Link>
              </li> */}

              {/* <li>
              <button onClick={handleLogout} className={classNameTab + " w-full end-0"}>
                <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
              </button>
            </li> */}
            </ul>
          </div>
          <div className="font-bold">
            <button
              onClick={handleLogout}
              className={"flex p-2 text-gray-900 rounded-lg  hover:bg-gray-100  w-full"}
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                />
              </svg>
              <span className="ms-3 whitespace-nowrap">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;
