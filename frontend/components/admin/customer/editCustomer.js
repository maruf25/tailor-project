"use client";
import React from "react";
import { useParams } from "next/navigation";

import FormCustomer from "./formCustomer";

const editOrder = () => {
  const { customerId } = useParams();

  return <FormCustomer isUpdate={true} customerId={customerId} />;
};

export default editOrder;
