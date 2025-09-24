import React from "react";

export default function IPChecker({ onIP }) {
  React.useEffect(() => {
    const getMyIPLocation = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        onIP?.(data.ip); // pass it up if the function exists
      } catch (error) {
        console.log(`IP fetching error: ${error}`);
      }
    };

    getMyIPLocation();
  }, [onIP]);

  return null;
}
