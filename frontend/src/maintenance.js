import Image from 'next/image';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';

const MaintenancePage = () => {
  const maintenanceEndTime = useSelector( (state) => state.settings.siteSettings?.advanced?.maintenanceEndTime );

  const [timeLeft, setTimeLeft] = useState({});

  const targetDate = useMemo(() => {
  if (!maintenanceEndTime) return null;
  const ts = Date.parse(maintenanceEndTime);
  return Number.isNaN(ts) ? null : new Date(ts); // stays in UTC
  }, [maintenanceEndTime]);

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
        const now = new Date();
        const diff = targetDate - now;
      
        if (diff <= 0) {
          setTimeLeft({ expired: true });
          return;
        }
      
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
      
        setTimeLeft({ days, hours, minutes, seconds }); 
      };
      

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
    }, [targetDate]);

  return (
    <>
      <Head>
        <title>We&apos;ll be back soon!</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <Image
        src="/animations/maintenance-bro.svg"
        alt="Maintenance Mode"
        width={600}
        height={400}
        className="w-full max-w-md mb-6"
        />

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Site Under Maintenance
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mb-4">
          We’re currently doing some upgrades to give you a better experience. Thanks for your patience!
        </p>

        {targetDate && !timeLeft.expired && (
            <div className="text-gray-700 text-lg mt-4">
                Estimated time left:
                <span className="ml-2 font-semibold space-x-2">
                <span className="text-blue-600">{timeLeft.days ?? 0}d</span>{" "}
                <span className="text-green-600">{timeLeft.hours ?? 0}h</span>{" "}
                <span className="text-yellow-600">{timeLeft.minutes ?? 0}m</span>{" "}
                <span className="text-red-600">{timeLeft.seconds ?? 0}s</span>
                </span>
            </div>
            )}



        {timeLeft.expired && (
          <div className="text-red-600 text-lg font-semibold mt-4">
            Maintenance period has ended.
          </div>
        )}
      </div>
    </>
  );
};

export default MaintenancePage;