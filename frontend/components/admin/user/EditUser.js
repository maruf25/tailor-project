"use client";
import React from "react";

import FormUser from "./FormUser";
import { useParams } from "next/navigation";

const EditUserComponent = () => {
  const { userId } = useParams();
  return <FormUser isUpdate={true} userId={userId} />;
};

export default EditUserComponent;
