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
        recovery: null,
      };
    }
  });
  const [game, setGame] = useState(initial.state);
  const [warning, setWarning] = useState(initial.warning);
  const [recovery, setRecovery] = useState(initial.recovery);
  const [recoveryOpen, setRecoveryOpen] = useState(Boolean(initial.recovery && !initial.recovery.backedUp));
  const [restartError, setRestartError] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [departing, setDeparting] = useState<Action | null>(null);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLElement>(null);
  const restartDialog = useRef<HTMLDialogElement>(null);
  const recoveryDialog = useRef<HTMLDialogElement>(null);
  const doc = currentDocument(game);
  const previousId = useRef(doc.id);
  useLayoutEffect(() => {
    if (previousId.current === doc.id) return;
    previousId.current = doc.id;
    paper.current
      ?.querySelector<HTMLElement>(".letter-reading")
      ?.scrollTo(0, 0);
    if (window.matchMedia("(max-width: 1199px), (max-height: 679px)").matches)
      window.scrollTo({ top: 0, behavior: "instant" });
    paper.current
      ?.querySelector<HTMLElement>("h1")
      ?.focus({ preventScroll: true });
  }, [doc.id]);
  // Apply the design scale before the first paint, including when the web font
  // is already ready. A passive effect can expose a frame at the default scale.
  useLayoutEffect(() => {
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
  useEffect(() => {
    if (recoveryOpen) recoveryDialog.current?.showModal();
    else recoveryDialog.current?.close();
  }, [recoveryOpen]);

  function persist(next: typeof game) {
    try {
      if (!saveGame(localStorage, next)) {
        setWarning(
          "这次进度未能保存。请保持页面开启，或检查浏览器的存储设置。",
        );
        return false;
      }
      setWarning("");
      setRecovery(null);
      return true;
    } catch {
      setWarning("这次进度未能保存。请保持页面开启，或检查浏览器的存储设置。");
      return false;
    }
  }
  function choose(action: Action, index?: number) {
    if (locked.current) return;
    if (recovery && !recovery.backedUp) {
      setReplyOpen(false);
      setRecoveryOpen(true);
      return;
    }
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
    if (!persist(next)) {
      setRestartError("重启未能保存，当前一季仍保留。请检查存储设置后再试。");
      return;
    }
    setRestartError("");
    setGame(next);
    setRestartOpen(false);
    setReplyOpen(false);
    requestAnimationFrame(() => {
      paper.current?.querySelector<HTMLElement>("h1")?.focus();
      window.scrollTo(0, 0);
    });
  }
  function exportDamagedSave() {
    if (!recovery) return;
    const url=URL.createObjectURL(new Blob([recovery.raw],{type:"text/plain;charset=utf-8"}));
    const link=document.createElement("a");
    link.href=url;link.download="dear-mayor-recovery.txt";link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function discardAndRestart() {
    if (!recovery) return;
    const next=newGame();
    try {
      if (!saveGame(localStorage,next,recovery.raw)) throw new Error("Not saved");
    } catch {
      setRecoveryError("未能重开：存储不可写，或原存档已变化。原文没有被替换，请重新载入后查看。");
      return;
    }
    setGame(next);setRecovery(null);setWarning("");setRecoveryOpen(false);
    requestAnimationFrame(()=>paper.current?.querySelector<HTMLElement>("h1")?.focus());
  }
  return (
    <main className="game-viewport" ref={frame}>
      <div className="viewport-background" aria-hidden="true" />
      <div className="scene" aria-label="小镇，请批示">
        <div className="game-table" inert={replyOpen || restartOpen || recoveryOpen}>
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
            onClick={() => {
              setRestartError("");
              if (recovery && !recovery.backedUp) setRecoveryOpen(true);
              else setRestartOpen(true);
            }}
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
          <aside className="save-warning" role="status" inert={replyOpen || restartOpen || recoveryOpen}>
            {warning}
            {recovery && !recovery.backedUp && <button onClick={()=>setRecoveryOpen(true)}>处理旧存档</button>}
            <button onClick={() => setWarning("")} aria-label="收起存档提示">
              收起
            </button>
          </aside>
        )}
      </div>
      <dialog
        ref={restartDialog}
        className="restart-dialog"
        aria-labelledby="restart-heading"
        onCancel={() => setRestartOpen(false)}
        onClose={() => setRestartOpen(false)}
      >
        <h2 id="restart-heading">另启一季？</h2>
        <p>这张书桌将换上最初的来信。当前进度会被替换，不能撤回。</p>
        {restartError && <p role="status">{restartError}</p>}
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
      <dialog ref={recoveryDialog} className="restart-dialog recovery-dialog"
        aria-labelledby="recovery-heading"
        onCancel={()=>setRecoveryOpen(false)} onClose={()=>setRecoveryOpen(false)}>
        <h2 id="recovery-heading">先保留这份旧存档</h2>
        <p>旧存档无法读取，恢复副本也未能写入。原始内容仍在；取消不会替换它。您可以先导出原文，留待修复。</p>
        {recoveryError && <p role="status">{recoveryError}</p>}
        <div>
          <button className="quiet-button" onClick={()=>setRecoveryOpen(false)} autoFocus>暂不开始</button>
          <button className="quiet-button" onClick={exportDamagedSave}>导出原始存档</button>
          <button className="quiet-button" onClick={discardAndRestart}>舍弃旧档并重开</button>
        </div>
      </dialog>
    </main>
  );
}
