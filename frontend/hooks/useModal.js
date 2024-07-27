"use client";

import { useState } from "react";

const useDeleteModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);

  const handleShowModal = (productId) => {
    if (showModal) {
      setSelectProduct(null);
    } else {
      setSelectProduct(productId);
    }
    setShowModal(!showModal);
  };

  return {
    showModal,
    handleShowModal,
    setShowModal,
    selectProduct,
  };
};

export default useDeleteModal;
