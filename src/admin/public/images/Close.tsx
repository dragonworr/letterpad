import React from "react";

const CloseIcon: React.FC<{ fill?: string }> = ({ fill }) => {
  if (!fill) fill = "#171818";
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.256593 0.876087C-0.0855311 1.21821 -0.0855312 1.77291 0.256594 2.11503L6.14157 8.00001L0.256616 13.885C-0.085509 14.2271 -0.0855093 14.7818 0.256616 15.1239L0.876087 15.7434C1.21821 16.0855 1.77291 16.0855 2.11503 15.7434L7.99999 9.85843L13.885 15.7434C14.2271 16.0855 14.7818 16.0855 15.1239 15.7434L15.7434 15.1239C16.0855 14.7818 16.0855 14.2271 15.7434 13.885L9.8584 8.00001L15.7434 2.11501C16.0855 1.77288 16.0855 1.21819 15.7434 0.876065L15.1239 0.256593C14.7818 -0.0855311 14.2271 -0.0855311 13.885 0.256593L7.99999 6.1416L2.11501 0.256615C1.77288 -0.0855095 1.21819 -0.0855098 0.876065 0.256615L0.256593 0.876087Z"
        fill={fill}
      />
    </svg>
  );
};

export default CloseIcon;