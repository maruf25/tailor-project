import React, { useState } from "react";

const SelectOption = (props) => {
  const [showSelect, setShowSelect] = useState(false);

  const handleValue = (valueOption) => {
    props.onSelect(valueOption);
    setShowSelect(false);
  };

  return (
    <div className="mb-2">
      <button
        className="text-gray-900 bg-gray-50 hover:bg-gray-100 focus:ring-4 border focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  w-full justify-center"
        onClick={() => setShowSelect(!showSelect)}
        type="button"
      >
        {props.state !== "" ? props.state : "Select Status"}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {showSelect && (
        <div id="dropdownSearch" className="z-10 w-full bg-white rounded-lg shadow ">
          <ul className="px-3 pb-3 overflow-y-auto text-sm text-gray-900 h-34 ">
            {props.options.map((option, key) => (
              <li key={key}>
                <div className="flex items-center rounded ps-2 hover:bg-gray-100 ">
                  <button
                    type="button"
                    className="w-full py-2 text-sm font-medium text-gray-900 rounded ms-2 "
                    onClick={handleValue.bind(this, option)}
                  >
                    {option}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectOption;
