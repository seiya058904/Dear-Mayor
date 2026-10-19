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
          media="(max-width: 720px)"
          srcSet={`${import.meta.env.BASE_URL}art/paper-mobile.png`}
        />
        <img
          className="paper-art"
          src={`${import.meta.env.BASE_URL}art/paper.png`}
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
        className={`letter-reading ${doc.id === "bridge/start" ? "first-letter" : ""}`}
        tabIndex={0}
        aria-label="文书正文"
      >
        <p className="salutation">{doc.salutation ?? "镇长大人："}</p>
        {doc.body.map((p, i) => (
          <p key={i}>
            {doc.id === "bridge/start"
              ? (i === 0
                  ? [
                      "北渡口之大桥，年久失修，桥面木板多已朽烂，",
                      "近日往来车马渐多，行经时屡有颠簸，部分板面已",
                      "出现断裂之虞。若不及时修缮，恐秋雨一至，桥身",
                      "更为损坏，不仅妨碍商旅往来，亦恐生险情。",
                    ]
                  : [
                      "恳请镇政厅批准修缮事宜，使工匠们尽早动工，",
                      "以保行旅平安。",
                    ]
                ).map((line, n) => (
                  <span className="reference-line" key={n}>
                    {line}
                  </span>
                ))
              : p}
          </p>
        ))}
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
