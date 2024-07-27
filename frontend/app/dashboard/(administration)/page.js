import React from "react";

import DashboardComponent from "@/components/admin/dashboard/dashboard";

export const metadata = {
  title: "Dashboard",
  description: "created for dashboard admin",
};

const DashboardPage = async () => {
  return <DashboardComponent />;
};

export default DashboardPage;
