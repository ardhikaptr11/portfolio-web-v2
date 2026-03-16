"use client";

import type { PlateElementProps } from "platejs/react";

import { useTocElement, useTocElementState } from "@platejs/toc/react";
import { cva } from "class-variance-authority";
import { PlateElement } from "platejs/react";

import { Button } from "@/components/ui/button";

const headingItemVariants = cva(
  "block h-auto w-full cursor-pointer truncate rounded-none px-0.5 py-1.5 text-left font-medium text-muted-foreground underline decoration-[0.5px] underline-offset-4 hover:bg-accent hover:text-muted-foreground",
  {
    variants: {
      depth: {
        1: "pl-0",
        2: "pl-1",
        3: "pl-2",
        4: "pl-3",
        5: "pl-5",
        6: "pl-8",
      },
    },
  },
);

export function TocElement(props: PlateElementProps) {
  const state = useTocElementState();
  const { props: btnProps } = useTocElement(state);
  const { headingList } = state;

  return (
    <PlateElement {...props} className="mb-1 p-0">
      <div contentEditable={false}>
        {headingList.length > 0 ? (
          headingList.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              className={headingItemVariants({
                depth: item.depth as 1 | 2 | 3 | 4 | 5 | 6,
              })}
              onClick={(e) => {
                const element = document.querySelector(
                  `[data-block-id="${item.id}"]`,
                );

                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              aria-current
            >
              {item.title}
            </Button>
          ))
        ) : (
          <div className="text-sm text-gray-500">
            Create a heading to display the table of contents.
          </div>
        )}
      </div>
      {props.children}
    </PlateElement>
  );
}
