"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthContext } from "@/providers/AuthContext";
import useDeleteModal from "@/hooks/useModal";
import { ToastContainer } from "react-toastify";
import useToast from "@/hooks/useToast";
import Modal from "@/components/UI/Modal";

const UserComponent = () => {
  const { showModal, handleShowModal, selectProduct, setShowModal } = useDeleteModal();
  const { notify } = useToast();
  const [users, setUsers] = useState([]);

  const router = useRouter();
  const { token } = useAuthContext();

  const getUsers = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API + "users/", {
        withCredentials: true,
      });
      const resData = await response.data.users;
      console.log(resData);
      setUsers(resData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
    }

    getUsers();
  }, [router]);

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(process.env.NEXT_PUBLIC_API + "users/" + userId, {
        withCredentials: true,
      });
      const resData = await response.data;
      console.log(resData);
      setShowModal(false);
      notify("success", "Success Delete User");
      getUsers();
    } catch (error) {
      setShowModal(false);
      notify("error", "Delete User Failed");
      console.log(error.response.data.message);
    }
  };

  return (
    <div>
      {showModal && (
        <Modal onShow={handleShowModal} onConfirm={handleDelete.bind(this, selectProduct)} />
      )}
      <ToastContainer />
      <Link
        href={"user/add"}
        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Register User
      </Link>

      <div className="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 rtl:text-right ">
          <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr className="bg-white border-b ">
                <td
                  scope="row"
                  colSpan={9}
                  className="px-6 py-4 font-medium text-center text-gray-900 "
                >
                  No User Found
                </td>
              </tr>
            )}
            {users.map((user, key) => (
              <tr className="bg-white border-b " key={key}>
                <th scope="row" className="px-6 py-4 font-medium text-center text-gray-900 ">
                  {user.name}
                </th>
                <td className="px-6 py-4 text-center">{user.username}</td>
                <td className="px-6 py-4">
                  <Link
                    href={"user/edit/" + user.id}
                    className="w-32 mx-auto text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center block mb-2 "
                  >
                    Edit
                  </Link>
                  <button
                    className="w-32 mx-auto text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center block mb-2 "
                    onClick={handleShowModal.bind(this, user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserComponent;
