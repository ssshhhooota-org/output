"use client";

import { useEffect, useRef } from "react";

export function CodeBlockEnhancer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const pres = ref.current.querySelectorAll("pre[data-theme]");
    pres.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper relative group";

      // ファイル名バーがあれば一緒にラップ
      const prev = pre.previousElementSibling;
      const hasTitle = prev?.hasAttribute("data-rehype-pretty-code-title");

      if (hasTitle && prev) {
        prev.parentElement?.insertBefore(wrapper, prev);
        wrapper.appendChild(prev);
      } else {
        // ファイル名がない場合のみ言語名を表示
        const lang = pre.getAttribute("data-language");
        if (lang) {
          const label = document.createElement("span");
          label.className =
            "absolute top-0 left-2 px-1 py-0.5 text-[0.7rem] text-neutral-400 z-10 pointer-events-none";
          label.textContent = lang;
          wrapper.appendChild(label);
        }
        pre.parentElement?.insertBefore(wrapper, pre);
      }

      // Copy ボタン
      const btn = document.createElement("button");
      btn.className =
        "absolute top-1.5 right-2 px-2 py-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 bg-[var(--card-bg)]/80 border border-[var(--border)] rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code?.textContent ?? "";
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        });
      });
      wrapper.appendChild(btn);

      wrapper.appendChild(pre);
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
