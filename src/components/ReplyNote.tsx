import { useEffect, useRef } from "react";
import type { Reply } from "../game/types";
export function ReplyNote({
  replies,
  onChoose,
  onClose,
}: {
  replies: Reply[];
  onChoose: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current
      ?.querySelector<HTMLButtonElement>("button[data-choice]")
      ?.focus();
  }, []);
  return (
    <div className="reply-shade" onClick={onClose}>
      <div
        className="reply-note"
        id="reply-note"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reply-heading"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
          if (e.key === "Tab") {
            const buttons = [
              ...ref.current!.querySelectorAll<HTMLButtonElement>("button"),
            ];
            if (e.shiftKey && document.activeElement === buttons[0]) {
              e.preventDefault();
              buttons.at(-1)?.focus();
            } else if (
              !e.shiftKey &&
              document.activeElement === buttons.at(-1)
            ) {
              e.preventDefault();
              buttons[0]?.focus();
            }
          }
        }}
      >
        <h2 id="reply-heading">提笔批示</h2>
        <div className="reply-options">
          {replies.map((r, i) => (
            <button
              type="button"
              data-choice={i}
              key={r.text}
              onClick={() => onChoose(i)}
            >
              <span className="reply-letter" aria-hidden="true">
                {"ABCD"[i]}
              </span>
              <span>{r.text}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="quiet-button close-note"
          onClick={onClose}
        >
          暂且收笔
        </button>
      </div>
    </div>
  );
}
