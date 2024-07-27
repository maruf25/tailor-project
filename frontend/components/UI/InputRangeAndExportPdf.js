import moment from "moment";
import React from "react";

const InputRangeAndExportPdf = (props) => {
  return (
    <div className="flex flex-col lg:gap-2 md:justify-between lg:justify-end lg:flex-row lg:items-center">
      <div className="flex items-center">
        <span className="mx-4 text-gray-500">from</span>
        <input
          id="startDate"
          type="date"
          name="startDate"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          value={props.startDate}
          onChange={(e) => {
            const value = e.target.value;
            props.setStartDate(value ? moment(value).format("YYYY-MM-DD") : "");
          }}
          max={props.endDate.toString()}
        />

        <span className="mx-4 text-gray-500">to</span>
        <input
          id="endDate"
          type="date"
          name="endDate"
          value={props.endDate}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          onChange={(e) => {
            const value = e.target.value;
            props.setEndDate(value ? moment(value).format("YYYY-MM-DD") : "");
          }}
          min={props.startDate.toString()}
          max={moment().format("YYYY-MM-DD")}
        />
      </div>
      <button
        className="flex gap-2 justify-center items-center mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2  focus:outline-none "
        onClick={() => props.handleExport(props.url_be, props.length, props.variant)}
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"
          />
        </svg>
        Export Pdf
      </button>
    </div>
  );
};

export default InputRangeAndExportPdf;
