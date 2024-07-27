"use client";
import React from "react";

import { useParams } from "next/navigation";
import FormInventory from "./FormInventory";

const EditInventoryComponent = () => {
  const { inventoryId } = useParams();
  return <FormInventory isUpdate={true} inventoryId={inventoryId} />;
};

export default EditInventoryComponent;
