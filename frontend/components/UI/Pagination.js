import React from "react";

const Pagination = (props) => {
  const startNumber = props.selectPage - 2;
  const endNumber = props.selectPage + 2;
  const length = Math.ceil(props.length);
  const pages = Array.from({ length }, (_, index) => index + 1);
  // const pages = Array.from({ length: props.length }, (_, index) => index + 1);

  const className =
    "flex items-center justify-center h-8 px-3 leading-tight text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ";
  const classNameActive =
    "z-10 flex items-center justify-center h-8 px-3 leading-tight text-gray-900 border border-gray-300 bg-gray-100";

  const handleSelectPage = (pageNumber) => {
    props.onClick(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {props.length >= 1 && (
        <nav aria-label="Page navigation example">
          <ul className="flex items-center h-8 -space-x-px text-sm">
            {props.selectPage !== 1 && (
              <li>
                <button
                  onClick={handleSelectPage.bind(this, props.selectPage - 1)}
                  className="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 ms-0 border-e-0 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              </li>
            )}
            {pages.map((number) => {
              if (
                (props.selectPage <= 5 && number <= 5) ||
                (props.selectPage >= props.length - 5 && number >= props.length - 5) ||
                (startNumber <= number && endNumber >= number) ||
                number === 1 ||
                number === props.length
              ) {
                return (
                  <li key={number}>
                    <button
                      className={props.selectPage == number ? classNameActive : className}
                      onClick={handleSelectPage.bind(this, number)}
                    >
                      {number}
                    </button>
                  </li>
                );
              }
              if (
                (props.selectPage >= 5 && number === 2) ||
                (props.selectPage <= props.length - 5 && number === props.length - 1)
              ) {
                return <li className={className}>...</li>;
              }
            })}
            {props.selectPage != props.length && (
              <li>
                <button
                  onClick={handleSelectPage.bind(this, props.selectPage + 1)}
                  className="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-2.5 h-2.5 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  );
};

export default Pagination;
