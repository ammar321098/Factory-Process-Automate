"use client";

import React, { useState, useEffect } from "react";
import { Rocket, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"; // ✅ i18n hook

const ComingSoonPage = () => {
  const t = useTranslations("ComingSoon");
  const router = useRouter();

  const [countdown, setCountdown] = useState({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Icon */}
      <div className="relative mb-8 animate-fade-in-up">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl">
          <Rocket className="h-10 w-10 text-white animate-bounce" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white text-center mb-4 animate-fade-in-up">
        {t("title")}
      </h1>

      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-10 animate-fade-in-up">
        {t("description")}
      </p>

      {/* Countdown */}
      <div className="flex gap-4 mb-12 animate-fade-in-up">
        {Object.entries(countdown).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl w-20 h-24 shadow-md"
          >
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {value.toString().padStart(2, "0")}
            </span>
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t(key)}
            </span>
          </div>
        ))}
      </div>

      {/* Home Button */}
      <div className="mt-12 animate-fade-in-up">
        <button
          onClick={() => router.push("/")}
          className="flex items-center px-5 py-3 text-sm font-medium rounded-full bg-gray-200/70 dark:bg-gray-700/70 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-gray-200"
        >
          <Home className="h-4 w-4 mr-2" />
          {t("backToDashboard")}
        </button>
      </div>
    </div>
  );
};

export default ComingSoonPage;
