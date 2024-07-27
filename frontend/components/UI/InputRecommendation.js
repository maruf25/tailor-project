import React from "react";

const InputRecommendation = (props) => {
  const classNameDisabled =
    " bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed";
  const classNameActive =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

  return (
    <div className="relative">
      <input
        type="text"
        id="name"
        name="name"
        className={props.isUpdate ? classNameDisabled : classNameActive}
        value={props.state}
        onChange={(e) => props.setState(e.target.value)}
        onFocus={() => props.setShowRecommendation(true)}
        required
        disabled={props.isUpdate}
      />
      {props.recommendation.length !== 0 && props.showRecommendation && (
        <ul className="absolute z-20 w-full px-3 pb-3 overflow-y-auto text-sm text-gray-700 rounded-lg bg-gray-50 h-28 ">
          {props.recommendation.map((inventory, key) => (
            <li key={key}>
              <div className="flex items-center rounded ps-2 hover:bg-gray-100 ">
                <button
                  type="button"
                  className="w-full py-2 text-sm font-medium text-gray-900 rounded ms-2 "
                  onClick={() => props.handleValue(inventory.name)}
                >
                  {inventory.name}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputRecommendation;
