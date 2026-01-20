"use client";

import { useEffect } from "react";
import { logout } from "../auth/actions";

const IdleTimer = ({ timeoutInMinutes = 60 }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleLogout = async () => await logout();

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(handleLogout, timeoutInMinutes * 60 * 1000);
    };

    // Watch user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer(); // Set timer on for the first time

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      clearTimeout(timer);
    };
  }, [timeoutInMinutes]);

  return null;
};

export default IdleTimer;
