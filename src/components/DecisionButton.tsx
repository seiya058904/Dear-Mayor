import type { Action } from "../game/types";
export const actions: { id: Action; label: string; description?: string }[] = [
  { id: "approve", label: "批准" },
  { id: "reject", label: "不批准" },
  {
    id: "defer",
    label: "搁置",
    description: "不回复、不办理；这与正式驳回不同。",
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
      onClick={onClick}
      aria-expanded={id === "written_reply" ? expanded : undefined}
      aria-controls={id === "written_reply" ? "reply-note" : undefined}
    >
      <img
        src={`${import.meta.env.BASE_URL}art/${id}.png`}
        alt=""
        draggable="false"
      />
    </button>
  );
}
