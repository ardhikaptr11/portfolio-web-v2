"use client";

import { Fragment, ReactNode, useEffect, useState } from "react";
import Loader from "./loader";
import { cn } from "@/lib/utils";

const ScreenLoader = ({
  children,
  taglines,
}: {
  children: ReactNode;
  taglines: { tagline: string; tagline_id: string };
}) => {
  const [isCounterDone, setCounterDone] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [shouldRenderLoader, setShouldRenderLoader] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isLoaded ? "unset" : "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoaded]);

  useEffect(() => {
    const finished = sessionStorage.getItem("isLoaderFinished") === "true";
    if (finished) {
      setIsLoaded(true);
      setShouldRenderLoader(false);
    }
  }, []);

  useEffect(() => {
    if (isCounterDone) {
      const timeout = setTimeout(() => {
        setAnimateOut(true);
        setIsLoaded(true);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [isCounterDone]);

  const handleFinish = () => {
    sessionStorage.setItem("isLoaderFinished", "true");
    setTimeout(() => setShouldRenderLoader(false), 1000);
  };

  return (
    <Fragment>
      {shouldRenderLoader && (
        <div
          className={cn(
            "fixed inset-0 z-9999 transition-transform duration-1000 ease-in-out",
            animateOut ? "-translate-y-full" : "translate-y-0",
          )}
        >
          <Loader
            taglines={taglines}
            animateOut={animateOut}
            onCounterDone={() => setCounterDone(true)}
            onFinish={handleFinish}
          />
        </div>
      )}

      <div
        className={cn(
          "transition-opacity duration-1000 ease-in-out",
          !isLoaded ? "opacity-0" : "opacity-100",
        )}
      >
        {children}
      </div>
    </Fragment>
  );
};

export default ScreenLoader;
