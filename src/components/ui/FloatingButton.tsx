"use client";

import type { ReactNode } from "react";

type FloatingButtonProps = {
  onClick: () => void;
  "aria-label": string;
  position: "bottom-left" | "bottom-right";
  children: ReactNode;
};

export function FloatingButton({
  onClick,
  "aria-label": ariaLabel,
  position,
  children,
}: FloatingButtonProps) {
  const positionClass = position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`fixed ${positionClass} z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden`}
    >
      {children}
    </button>
  );
}
