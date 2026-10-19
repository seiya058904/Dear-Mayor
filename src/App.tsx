import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { currentDocument, decide, newGame } from "./game/engine";
import { loadGame, saveGame } from "./game/persistence";
import type { Action } from "./game/types";
import { actions, DecisionButton } from "./components/DecisionButton";
import { Petition } from "./components/Petition";
import { ReplyNote } from "./components/ReplyNote";

export default function App() {
  const [initial] = useState(() => {
    try {
      return loadGame(localStorage);
    } catch {
      return {
        state: newGame(),
        warning: "浏览器暂不能保存进度，关闭页面后可能无法继续。",
      };
    }
  });
  const [game, setGame] = useState(initial.state);
  const [warning, setWarning] = useState(initial.warning);
  const [replyOpen, setReplyOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [departing, setDeparting] = useState<Action | null>(null);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLElement>(null);
  const restartDialog = useRef<HTMLDialogElement>(null);
  const doc = currentDocument(game);
  const previousId = useRef(doc.id);
  useLayoutEffect(() => {
    if (previousId.current === doc.id) return;
    previousId.current = doc.id;
    paper.current
      ?.querySelector<HTMLElement>(".letter-reading")
      ?.scrollTo(0, 0);
    if (window.innerWidth <= 720)
      window.scrollTo({ top: 0, behavior: "instant" });
    paper.current
      ?.querySelector<HTMLElement>("h1")
      ?.focus({ preventScroll: true });
  }, [doc.id]);
  useEffect(() => {
    const resize = () => {
      const scale = Math.min(
        window.innerWidth / 1672,
        window.innerHeight / 941,
      );
      frame.current?.style.setProperty("--scene-scale", String(scale));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (restartOpen) restartDialog.current?.showModal();
    else restartDialog.current?.close();
  }, [restartOpen]);

  function persist(next: typeof game) {
    try {
      if (!saveGame(localStorage, next))
        setWarning(
          "这次进度未能保存。请保持页面开启，或检查浏览器的存储设置。",
        );
    } catch {
      setWarning("这次进度未能保存。请保持页面开启，或检查浏览器的存储设置。");
    }
  }
  function choose(action: Action, index?: number) {
    if (locked.current) return;
    const next = decide(game, doc.id, action, index);
    if (next === game) return;
    locked.current = true;
    persist(next); // Commit before animation; a reload can never duplicate this decision.
    setReplyOpen(false);
    setDeparting(action);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timer.current = setTimeout(
      () => {
        setGame(next);
        setDeparting(null);
        locked.current = false;
      },
      reduced ? 25 : 460,
    );
  }
  function closeReply() {
    setReplyOpen(false);
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLButtonElement>(".decision-written_reply")
        ?.focus(),
    );
  }
  function restart() {
    if (locked.current) return;
    const next = newGame();
    persist(next);
    setGame(next);
    setRestartOpen(false);
    setReplyOpen(false);
    requestAnimationFrame(() => {
      paper.current?.querySelector<HTMLElement>("h1")?.focus();
      window.scrollTo(0, 0);
    });
  }
  return (
    <main className="game-viewport" ref={frame}>
      <div className="scene" aria-label="小镇，请批示">
        <div className="desk-background" aria-hidden="true" />
        <div className="game-table" inert={replyOpen || restartOpen}>
          <Petition
            key={doc.id}
            ref={paper}
            doc={doc}
            day={game.day}
            departing={departing}
          />
          <nav
            className="decisions"
            aria-label="处理这份文书"
            aria-busy={Boolean(departing)}
          >
            {actions.map((a) => (
              <DecisionButton
                key={a.id}
                {...a}
                disabled={Boolean(departing)}
                expanded={replyOpen}
                onClick={() =>
                  a.id === "written_reply" ? setReplyOpen(true) : choose(a.id)
                }
              />
            ))}
          </nav>
          <button
            type="button"
            className="restart-link"
            disabled={Boolean(departing)}
            onClick={() => setRestartOpen(true)}
          >
            重启一季
          </button>
        </div>
        {replyOpen && (
          <ReplyNote
            replies={doc.replies}
            onChoose={(i) => choose("written_reply", i)}
            onClose={closeReply}
          />
        )}
        {warning && (
          <aside className="save-warning" role="status">
            {warning}
            <button onClick={() => setWarning("")} aria-label="收起存档提示">
              收起
            </button>
          </aside>
        )}
      </div>
      <dialog
        ref={restartDialog}
        className="restart-dialog"
        onCancel={() => setRestartOpen(false)}
        onClose={() => setRestartOpen(false)}
      >
        <h2>另启一季？</h2>
        <p>这张书桌将换上最初的来信。当前进度会被替换，不能撤回。</p>
        <div>
          <button
            className="quiet-button"
            onClick={() => setRestartOpen(false)}
            autoFocus
          >
            继续批阅
          </button>
          <button className="quiet-button" onClick={restart}>
            确认重启
          </button>
        </div>
      </dialog>
    </main>
  );
}
