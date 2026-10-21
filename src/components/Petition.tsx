import { forwardRef } from "react";
import type { Document, Action } from "../game/types";
import { dateLabel } from "../game/engine";
export const Petition = forwardRef<
  HTMLElement,
  { doc: Document; day: number; departing: Action | null }
>(function Petition({ doc, day, departing }, ref) {
  return (
    <article
      ref={ref}
      className={`petition ${departing ? `departing departure-${departing}` : "arriving"}`}
      aria-labelledby="letter-title"
      data-letter-id={doc.id}
    >
      <picture>
        <source
          media="(max-width: 1199px), (max-height: 679px)"
          srcSet={`${import.meta.env.BASE_URL}art/paper-mobile.webp`}
        />
        <img
          className="paper-art"
          src={`${import.meta.env.BASE_URL}art/paper.webp`}
          alt=""
          draggable="false"
        />
      </picture>
      <div className="letter-date">{dateLabel(day)}</div>
      <h1
        id="letter-title"
        tabIndex={-1}
        className={doc.title.length > 10 ? "long-title" : ""}
      >
        {doc.title}
      </h1>
      <div className="letter-source">来源：{doc.sender}</div>
      <div
        className="letter-reading"
        tabIndex={0}
        aria-label="文书正文"
      >
        <p className="salutation">{doc.salutation ?? "镇长大人："}</p>
        {doc.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="signature">{doc.sender}</div>
      {departing && departing !== "defer" && (
        <div aria-hidden="true" className={`decision-stamp stamp-${departing}`}>
          {departing === "approve"
            ? "准"
            : departing === "reject"
              ? "驳"
              : "已批"}
        </div>
      )}
    </article>
  );
});
