import type { Action } from "../game/types";
export const deferDescription = "搁置即不回复、不办理；此信不会留待稍后处理。";
export const actions: { id: Action; label: string; description?: string }[] = [
  { id: "approve", label: "批准" },
  { id: "reject", label: "不批准" },
  {
    id: "defer",
    label: "搁置",
    description: deferDescription,
  },
  { id: "written_reply", label: "批示回复" },
];
export function DecisionButton({
  id,
  label,
  description,
  disabled,
  expanded,
  onClick,
}: (typeof actions)[number] & {
  disabled: boolean;
  expanded?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`decision decision-${id}`}
      aria-label={label}
      title={description}
      aria-description={description}
      disabled={disabled}
      onClick={(event) => {
        // Reduced motion changes letters before a native double click finishes.
        // Its later clicks belong to the same gesture, not the next letter.
        if (event.detail <= 1) onClick();
      }}
      aria-expanded={id === "written_reply" ? expanded : undefined}
      aria-controls={id === "written_reply" ? "reply-note" : undefined}
    >
      <img
        src={`${import.meta.env.BASE_URL}art/${id}.webp`}
        alt=""
        draggable="false"
      />
    </button>
  );
}
