import { useAuthContext } from "@/providers/AuthContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SelectWithSearch = (props) => {
  const [showSelect, setShowSelect] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const getCustomers = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API + "customer?search=" + searchQuery,
        {
          withCredentials: true,
        }
      );
      const resData = await response.data.customers;

      setCustomers(resData.rows);
    } catch (error) {
      if (error.response.status === 401) {
        router.push("/login");
      } else if (error.response.status === 403) {
        router.push("/403");
      }
    }
  };

  useEffect(() => {
    getCustomers();
  }, [searchQuery]);

  const handleValue = (customer) => {
    props.setSelectCustomerName(customer.name);
    props.onSelectCustomer(customer);
    setShowSelect(false);
  };

  return (
    <div className="mb-2">
      <button
        className="relative text-gray-900 bg-gray-50 border hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  w-60 justify-center"
        onClick={() => setShowSelect(!showSelect)}
        type="button"
      >
        {props.selectCustomerName !== "" ? props.selectCustomerName : "Select Customer"}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {showSelect && (
        <div id="dropdownSearch" className="absolute z-10 bg-white rounded-lg shadow w-60 ">
          <div className="p-3">
            <label htmlFor="input-group-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 flex items-center pointer-events-none rtl:inset-r-0 start-0 ps-3">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="input-group-search"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search user"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 ">
            {customers.length === 0 && <p className="text-center">No Customer Found</p>}
            {customers.map((customer, key) => (
              <li key={key}>
                <div className="flex items-center rounded ps-2 hover:bg-gray-100 ">
                  <button
                    type="button"
                    className="w-full py-2 text-sm font-medium text-gray-900 rounded ms-2 "
                    onClick={handleValue.bind(this, customer)}
                  >
                    {customer.name}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectWithSearch;
