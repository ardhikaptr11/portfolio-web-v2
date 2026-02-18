"use client";

import { HTMLMotionProps, motion } from "motion/react";

const Transition = ({
  initial,
  whileInView,
  transition,
  ...rest
}: HTMLMotionProps<"div">) => {
  const init = initial ? initial : { opacity: 0 };
  const inView = whileInView ? whileInView : { opacity: 1 };
  const trans = transition ? transition : { duration: 0.8, delay: 0.4 };

  return (
    <motion.div
      initial={init}
      whileInView={inView}
      transition={trans}
      {...rest}
    />
  );
};

const OpacityTransition = ({ children }: { children: string }) => {
  const lines = children.split("\n");

  let globalCharIndex = 0;

  return (
    <div className="overflow-hidden">
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");

        return (
          <div key={lineIndex} className="flex flex-wrap">
            {words.map((word, wordIndex) => {
              const letters = word.split("");
              const wordStartIndex = globalCharIndex;
              globalCharIndex += letters.length + 1;

              return (
                <div key={wordIndex} className="inline-block whitespace-nowrap">
                  {letters.map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={{ opacity: 0.1 }}
                      animate={{ opacity: 1 }}
                      layout
                      transition={{
                        delay: (wordStartIndex + charIndex) * 0.03,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                  <span className="inline-block">&nbsp;</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export { Transition, OpacityTransition };
