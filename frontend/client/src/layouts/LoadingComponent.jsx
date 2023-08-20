import React, { useState, useEffect } from "react";

const LoadingComponent = () => {
  const [dots, setDots] = useState(""); // State to manage the dots

  useEffect(() => {
    const interval = setInterval(() => {
      // Add a dot to the existing dots
      setDots((prevDots) => (prevDots.length === 3 ? "" : prevDots + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='text-xl w-48 text-[#646668] border-2 border-[#646668] px-4 py-2 rounded'>
      Brewing Styles{dots}
    </div>
  );
};

export default LoadingComponent;
