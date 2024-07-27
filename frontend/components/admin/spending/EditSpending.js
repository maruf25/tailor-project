"use client";
import React from "react";
import { useParams } from "next/navigation";
import FormSpending from "./FormSpending";

const EditSpendingComponent = () => {
  const { spendingId } = useParams();
  return <FormSpending isUpdate={true} spendingId={spendingId} />;
};

export default EditSpendingComponent;
