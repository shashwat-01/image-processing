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
    <div className="text-xl w-48 bg-slate-200 text-black border-2 border-gray-700 px-4 py-2 rounded-lg">
      Brewing Styles{dots}
    </div>
  );
};

export default LoadingComponent;
