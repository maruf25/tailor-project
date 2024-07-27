"use client";
import React from "react";
import { useParams } from "next/navigation";

import FormOrder from "./formOrder";

const editOrder = () => {
  const { orderId } = useParams();
  return <FormOrder isUpdate={true} orderId={orderId} />;
};

export default editOrder;
