import { FC, CSSProperties } from "react";

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
  size?: string;
}

interface CustomCSSProperties extends CSSProperties {
  "--after-duration": string;
  "--before-duration": string;
  "--after-shadow": string;
  "--before-shadow": string;
}

const GlitchText: FC<GlitchTextProps> = ({
  children,
  speed = 0.5,
  enableShadows = true,
  enableOnHover = false,
  className = "",
  size = "text-[clamp(2rem,15vw,12rem)]",
}) => {
  const inlineStyles: CustomCSSProperties = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-3px 0 #ef4444" : "none",
    "--before-shadow": enableShadows ? "3px 0 #22d3ee" : "none",
  };

  const baseClasses =
    `text-white ${size} font-black relative select-none cursor-none`;

  const pseudoClasses = !enableOnHover
    ? "after:content-[attr(data-text)] after:absolute after:inset-0 after:left-[2px] after:text-white after:bg-transparent after:overflow-hidden after:animate-glitch-after after:[text-shadow:var(--after-shadow)] " +
      "before:content-[attr(data-text)] before:absolute before:inset-0 before:left-[-2px] before:text-white before:bg-transparent before:overflow-hidden before:animate-glitch-before before:[text-shadow:var(--before-shadow)]"
    : "after:content-[''] after:absolute after:inset-0 after:left-[2px] after:text-white after:bg-transparent after:overflow-hidden after:opacity-0 " +
      "before:content-[''] before:absolute before:inset-0 before:left-[-2px] before:text-white before:bg-transparent before:overflow-hidden before:opacity-0 " +
      "hover:after:content-[attr(data-text)] hover:after:opacity-100 hover:after:[text-shadow:var(--after-shadow)] hover:after:animate-glitch-after " +
      "hover:before:content-[attr(data-text)] hover:before:opacity-100 hover:before:[text-shadow:var(--before-shadow)] hover:before:animate-glitch-before";

  return (
    <div
      style={inlineStyles}
      data-text={children}
      className={`${baseClasses} ${pseudoClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlitchText;
