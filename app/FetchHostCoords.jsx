import React, { useEffect, useRef, useState } from 'react';

export default function FetchHostCoords({setHostCoords,checkinProgValue}){
    
      useEffect(() => {
        // Clear any previously valid coordinates when programme changes
        setHostCoords({ lat: null, lon: null });
      }, [checkinProgValue]);
    
      // Main polling logic
      const triedProgrammesRef = useRef(new Set());
      const attemptsMapRef = useRef(new Map()); // 💡 Track attempts per programme
    
      useEffect(() => {
        let intervalId;
    
        const fetchHostCoords = async () => {
          const currentProg = checkinProgValue;
          let attempts = attemptsMapRef.current.get(currentProg) || 0;
    
          // Prevent extra calls after 5 attempts
          if (attempts >= 5) {
            clearInterval(intervalId);
            return;
          }
    
          try {
            const response = await fetch(`https://attendict-apk.onrender.com/api/host-location?programme=${currentProg}`);
            const data = await response.json();
    
            if (data?.location?.lat && data?.location?.lon) {
              setHostCoords({ lat: data.location.lat, lon: data.location.lon });
              clearInterval(intervalId);
            } else {
              attempts += 1;
              attemptsMapRef.current.set(currentProg, attempts); // 🔁 Track attempts
    
              if (attempts >= 5) {
                clearInterval(intervalId);
                triedProgrammesRef.current.add(currentProg);
                console.log("❌ Host location not found after 5 attempts.");
              }
            }
          } catch (err) {
            console.log("❌ Error fetching host location:", err);
            attempts += 1;
            attemptsMapRef.current.set(currentProg, attempts);
    
            if (attempts >= 5) {
              clearInterval(intervalId);
              triedProgrammesRef.current.add(currentProg);
            }
          }
        };
    
        const currentProg = checkinProgValue;
    
        if (
          currentProg?.length === 5 &&
          !triedProgrammesRef.current.has(currentProg)
        ) {
          intervalId = setInterval(fetchHostCoords, 500);
        }
    
        return () => clearInterval(intervalId);
      }, [checkinProgValue]);




    return null
}