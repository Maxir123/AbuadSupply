import React, { useEffect, useState } from "react";

const CountdownTimer = ({
  endDate,
  textColor = "text-gray-900",
  bgColor = "bg-white",
  textSize = "text-lg",
  className = "",
  showLabels = true,
  onExpire = null, // optional callback when timer expires
}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    if (!endDate) return;

    const calculate = () => {
      const now = new Date().getTime();
      const difference = new Date(endDate).getTime() - now;

      if (difference <= 0) {
        setTimeLeft(null);
        setExpired(true);
        if (onExpire) onExpire();
        return;
      }

      setExpired(false);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  // If not hydrated or no endDate, show placeholder
  if (!isHydrated || !endDate) {
    return (
      <div className={`countdown-timer ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          {["00", "00", "00", "00"].map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <span
                className={`${textSize} font-bold ${bgColor} ${textColor} px-3 py-2 rounded-lg shadow-sm`}
              >
                {value}
              </span>
              {showLabels && (
                <span className={`text-xs ${textColor} opacity-75 mt-1`}>
                  {["Days", "Hrs", "Mins", "Secs"][index]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className={`countdown-timer ${className}`}>
        <div className={`${textSize} font-semibold ${textColor}`}>
          Offer expired
        </div>
      </div>
    );
  }

  return (
    <div className={`countdown-timer ${className}`}>
      <div className="flex items-center justify-center space-x-3">
        {Object.entries(timeLeft).map(([unit, value], index) => (
          <div key={unit} className="flex flex-col items-center">
            <span
              className={`${textSize} font-bold ${bgColor} ${textColor} px-3 py-2 rounded-lg shadow-sm transition-all duration-300 hover:scale-105`}
            >
              {value.toString().padStart(2, "0")}
            </span>
            {showLabels && (
              <span className={`text-xs ${textColor} opacity-75 mt-1`}>
                {["Days", "Hrs", "Mins", "Secs"][index]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;