"use client";

import { Fragment, ReactNode, useEffect, useState } from "react";
import Loader from "./loader";
import { IHero } from "../types/data";

const ScreenLoader = ({
  children,
  taglines,
}: {
  children: ReactNode;
  taglines: { tagline: string, tagline_id: string };
}) => {
  const [isCounterDone, setCounterDone] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean | null>(null);

  useEffect(() => {
    const isLoaderFinished = sessionStorage.getItem("isLoaderFinished");
    setIsLoaded(isLoaderFinished === "true");
  }, []);

  useEffect(() => {
    if (isCounterDone) {
      const timeout = setTimeout(() => setAnimateOut(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [isCounterDone]);

  const handleFinish = () => {
    sessionStorage.setItem("isLoaderFinished", "true");
    setIsLoaded(true);
  };

  if (isLoaded === null) return null;

  if (!isLoaded) {
    return (
      <Loader
        taglines={taglines}
        animateOut={animateOut}
        onCounterDone={() => setCounterDone(true)}
        onFinish={handleFinish}
      />
    );
  }

  return <Fragment>{children}</Fragment>;
};

export default ScreenLoader;
