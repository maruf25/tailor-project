"use client";
import axios from "axios";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const useExportPdf = () => {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const page = searchParams.get("page");
  const [loading, setLoading] = useState(false);

  const initialStart = start ? moment(start).format("YYYY-MM-DD") : "";
  const initialEnd = end ? moment(end).format("YYYY-MM-DD") : "";
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const handleExport = async (url_be, length, variant) => {
    let fileName = `${variant.toUpperCase()} All of Time.pdf`;

    if (
      moment(startDate, "YYYY-MM-DD", true).isValid() ||
      moment(endDate, "YYYY-MM-DD", true).isValid()
    ) {
      fileName = `${variant.toUpperCase()} ${startDate} sampai ${endDate}.pdf`;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API + url_be;

    let params = new URLSearchParams();

    params.append("length", length);
    params.append("variant", variant);

    if (startDate !== "" && endDate !== "") {
      params.append("start", startDate);
      params.append("end", endDate);
    }

    const urlApi = `${baseUrl}?${params.toString()}`;

    try {
      setLoading(true);
      const response = await axios.get(urlApi, {
        withCredentials: true,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          alert("Error export pdf, try again!");
        }
      } else if (error.request) {
        console.error("No response received from server. It might be down.");
        alert("Cannot connect to the server. It might be down.");
      }
    }
    setLoading(false);
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    page,
    handleExport,
  };
};

export default useExportPdf;
