"use client";

import { Tilt } from "@/app/(root)/components/tilt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatToSlug } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useScroll,
  UseScrollOptions,
  useTransform,
} from "framer-motion";
import { XIcon } from "lucide-react";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Typewriter from "typewriter-effect/dist/core";
import { IExperience } from "../../types/data";
import { ExperienceCard } from "../cards";
import SectionHeader from "../section-header";
import { useTranslations } from "next-intl";

interface IOutputEntries {
  type: string;
  content: string | ReactNode;
  color?: string;
  isInitial?: boolean;
}

// This is only for decorative purposes
const WORK_PERMISSIONS = {
  full_time: "drwxr-xr-x",
  contract: "dr-xr--r--",
  freelance: "-rw-r--r--",
  internship: "dr-xr-xr-x",
};

const Prompt = () => (
  <p className="mr-2 shrink-0 font-mono text-xs md:text-sm">
    <span className="text-ocean-teal font-bold">user@ardhikaputra</span>
    <span className="text-cyan-100/50">:</span>
    <span className="font-bold text-cyan-400">~/web-portfolio</span>
    <span className="ml-1 text-white/70">$</span>
  </p>
);

const Experiences = ({ experiences }: { experiences: IExperience[] }) => {
  const t = useTranslations("Experiences");

  const DEFAULT_HISTORY = useMemo(
    () => [
      {
        type: "text",
        content: `${t("terminal.promptsHeader.line1")} Experience CLI v1.0.0 (Kernel 11.10.00-mainline)`,
        color: "text-cyan-400/80",
      },
      {
        type: "text",
        content: `${t("terminal.promptsHeader.line2")}`,
        color: "text-ocean-teal/60",
      },
      {
        type: "text",
        content: `${t("terminal.promptsHeader.line3")}`,
        color: "text-ocean-teal/60",
      },
      {
        type: "text",
        content: "",
        color: "py-0.5",
      },
    ],
    [],
  );

  const [session, setSession] = useState<"idle" | "active">("idle");
  const [history, setHistory] = useState<IOutputEntries[]>(DEFAULT_HISTORY);
  const [inputValue, setInputValue] = useState("");
  const [previewAsset, setPreviewAsset] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // The animation start when the top of the element just appears from the bottom of the screen
  const offset: UseScrollOptions["offset"] = ["start end", "end start"];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewAsset(null);
      }
    };

    if (previewAsset) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [previewAsset]);

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const triggerInitialLoad = () => {
      const initialCmd = "cat -a";

      const newEntries: IOutputEntries[] = [
        { type: "command", content: initialCmd },
      ];

      experiences.forEach((experience) => {
        newEntries.push({
          type: "component",
          content: <ExperienceCard experience={experience} />,
        });
      });

      setHistory((prev) => [...prev, ...newEntries]);
    };

    // Delay for smooth transition
    const timer = setTimeout(triggerInitialLoad, 1000);

    const dummyNode = document.createElement("div");

    typewriterRef.current = new Typewriter(dummyNode, {
      loop: true,
      delay: 40,
      onCreateTextNode: (char: string) => {
        if (inputRef.current && inputValue === "")
          inputRef.current.placeholder += char;
        return null;
      },
      onRemoveNode: () => {
        if (inputRef.current)
          inputRef.current.placeholder = inputRef.current.placeholder.slice(
            0,
            -1,
          );
      },
    });

    typewriterRef.current
      .typeString("cat -a")
      .pauseFor(2000)
      .deleteAll()
      .typeString("cat frontend-developer.tsx")
      .pauseFor(2000)
      .deleteAll()
      .typeString("cat backend-developer.tsx")
      .pauseFor(2000)
      .deleteAll()
      .typeString("cat it-programmer.tsx")
      .pauseFor(2000)
      .deleteAll()
      .typeString("cat bootcamp-trainee.tsx")
      .pauseFor(2000)
      .deleteAll()
      .start();

    return () => {
      clearTimeout(timer);
      typewriterRef.current?.stop();
    };
  }, [experiences]);

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();

    const cmdLine = inputValue.trim();
    if (!cmdLine) return;

    const newHistoryEntry = { type: "command", content: inputValue };
    let outputEntries: IOutputEntries[] = [];

    const parts = cmdLine.split(" ");
    const mainCommand = parts[0];
    const arg = parts[1] || "";

    if (mainCommand === "cat" && arg === "-a") {
      experiences.forEach((experience) => {
        outputEntries.push({
          type: "component",
          content: <ExperienceCard experience={experience} />,
        });
      });
    } else if (mainCommand === "ls") {
      outputEntries.push({
        type: "component",
        content: (
          <div className="my-2 ml-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className="group flex cursor-pointer items-center gap-3 transition-all"
                onClick={() => {
                  setInputValue(`cat ${formatToSlug(experience.role)}.tsx`);
                  inputRef.current?.focus();
                }}
              >
                {/* Decoration */}
                <p className="font-mono text-[10px] font-bold text-teal-600/70 uppercase">
                  {WORK_PERMISSIONS[experience.work_category]}
                </p>
                <p className="decoration-ocean-teal/20 text-cyan-100 underline group-hover:text-teal-400 group-hover:decoration-teal-400">
                  {formatToSlug(experience.role)}.tsx
                </p>
              </div>
            ))}
          </div>
        ),
      });
    } else if (mainCommand === "cat") {
      if (!arg) {
        outputEntries.push({
          type: "text",
          content: `EMPTY_REQUEST: ${t("terminal.errorLines.error1")}. Format: cat [slug].tsx`,
          color: "text-rose-400",
        });
      } else if (!arg.endsWith(".tsx")) {
        outputEntries.push({
          type: "text",
          content: `INVALID_PATH: ${t("terminal.errorLines.error2", { arg })}`,
          color: "text-rose-400",
        });
      } else {
        const slug = arg.replace(".tsx", "");
        const found = experiences.find(
          (experience) => formatToSlug(experience.role) === slug,
        );

        if (found) {
          outputEntries.push({
            type: "component",
            content: <ExperienceCard experience={found} />,
          });
        } else {
          outputEntries.push({
            type: "text",
            content: `DATA_NOT_FOUND: ${t("terminal.errorLines.error3", { arg })}`,
            color: "text-rose-400",
          });
        }
      }
    } else if (mainCommand === "clear") {
      setHistory(DEFAULT_HISTORY);
      setInputValue("");
      return;
    } else if (mainCommand === "help") {
      outputEntries.push({
        type: "text",
        content: "SYSTEM_DIRECTIVES (v1.0.0) - AUTH_LEVEL: GUEST",
        color: "text-ocean-teal",
      });

      const HELP_LINES = [
        { command: "ls", description: `${t("terminal.helpLines.help1")}` },
        { command: "cat -a", description: `${t("terminal.helpLines.help2")}` },
        {
          command: "cat [slug].tsx",
          d: `${t("terminal.helpLines.help3")}`,
        },
        { command: "clear", description: `${t("terminal.helpLines.help4")}` },
      ];

      outputEntries.push({
        type: "component",
        content: (
          <table className="mt-1 border-separate border-spacing-x-4 font-mono text-sm opacity-80">
            <tbody>
              {HELP_LINES.map((item) => (
                <tr key={item.command} className="align-top">
                  <td className="font-bold text-teal-400">
                    {item.description}
                  </td>
                  <td className="text-cyan-100/70">: {item.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ),
      });
    } else {
      outputEntries.push({
        type: "text",
        content: `COMMAND_UNKNOWN: ${t("terminal.errorLines.error4", { mainCommand })}`,
        color: "text-rose-500 font-bold",
      });
    }

    setHistory((prev) => [...prev, newHistoryEntry, ...outputEntries]);
    setInputValue("");
  };

  return (
    <section id="experiences" ref={containerRef} className="px-6 pt-32 text-sm">
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0.1, 0.25], [0, 1]),
          y: useTransform(scrollYProgress, [0.1, 0.25], [40, 0]),
          filter: useTransform(
            scrollYProgress,
            [0.1, 0.25],
            ["blur(10px)", "blur(0px)"],
          ),
        }}
        className="mx-auto flex max-w-6xl flex-col items-center"
      >
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          shouldAnimate={false}
          className="mb-12!"
        />

        <Tilt
          rotationFactor={8}
          isReverse
          className="group relative size-full font-mono"
        >
          <div
            onClick={() => inputRef.current?.focus()}
            className="border-ocean-teal/20 shadow-ocean-glow mx-auto max-w-5xl overflow-hidden rounded-xl border bg-[#020c1b]/90 backdrop-blur-md"
          >
            {/* Terminal Header */}
            <div className="border-ocean-teal/20 flex items-center justify-between border-b bg-teal-950/30 px-4 py-3">
              <div className="flex gap-2">
                <div className="border-destructive/20 bg-destructive/50 size-3 rounded-full border" />
                <div className="size-3 rounded-full border border-amber-500/20 bg-amber-500/50" />
                <div className="border-ocean-teal/20 bg-ocean-teal/50 size-3 rounded-full border" />
              </div>
              <p className="text-ocean-teal/40 text-[9px] font-bold tracking-widest uppercase">
                Status: {session}
              </p>
            </div>

            {/* Terminal Body */}
            <div
              ref={scrollRef}
              className="oceanic-terminal-scrollbar h-150 overflow-y-auto p-6 text-cyan-50/80"
            >
              {history.map((item, i) => (
                <div key={i} className="mb-3">
                  {item.type === "command" && (
                    <div className="flex items-center">
                      <Prompt />
                      <p className="font-medium text-white">{item.content}</p>
                    </div>
                  )}
                  {item.type === "text" && (
                    <p
                      className={cn(
                        "block opacity-90",
                        item.color || "text-cyan-100/60",
                      )}
                    >
                      {item.content}
                    </p>
                  )}
                  {item.type === "component" && (
                    <div className="w-full">{item.content}</div>
                  )}
                </div>
              ))}

              {/* Form Input */}
              <form onSubmit={handleCommand} className="mt-4 flex items-center">
                <Prompt />
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setSession("active");
                  }}
                  onFocus={() => setSession("active")}
                  onBlur={() => setSession("idle")}
                  className="flex-1 border-0 bg-transparent! p-0 font-mono text-white caret-teal-400 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  spellCheck={false}
                  autoComplete="off"
                  style={{ caretShape: "block" }}
                />
              </form>
            </div>
          </div>
        </Tilt>
        <div className="from-ocean-teal/30 h-28 w-px bg-linear-to-b to-transparent" />
      </motion.div>
    </section>
  );
};

export default Experiences;
