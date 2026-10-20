import { documents } from "../content";
import { catalogAt, latestCatalogRevision } from "./catalog";
import type { Action, Branch, Document, GameState } from "./types";

export function newGame(seed = 6271, revision = latestCatalogRevision): GameState {
  catalogAt(revision);
  return {
    version: 2,
    contentVersion: 4,
    v3Length: 0,
    initialCatalogRevision: revision,
    catalogRevision: revision,
    v2Length: 0,
    legacyLength: 0,
    day: 1,
    inDay: 0,
    current: "bridge/start",
    seed,
    history: [],
    pending: [],
    started: ["bridge"],
    readDaily: [],
    facts: {},
    seasonal: 0,
  };
}

const seasonalRequests = [
  [
    "换季的门垫",
    "新一季将至，镇厅门口的草垫已经磨薄。雨天来送信的人总先在门口跳两下，再郑重地把干燥的信交进来。书记官想换一块结实草垫，让大家进门时不必像参加舞会。请准由编席人收旧换新，旧草垫洗净后留作花盆底衬。",
    "换一张结实草垫",
    "请编席人先补好磨损处",
    "把门口遮雨布延长一点",
    "先借一张集市闲置草垫",
  ],
  [
    "送信人的雨披",
    "驿夫塞缪尔的雨披又该补线了。他每次都把信藏在最干的内侧，自己像一棵刚从河里走出来的树。如今他申请领取一小块防雨布，只补肩背，不做新衣。请准这项修补，让下一个雨天至少有一个送信的人也能干着回来。",
    "领取防雨布补雨披",
    "请裁缝检查接缝后再补",
    "借一件备用雨披轮换晾干",
    "给驿站设一处晾披挂钩",
  ],
  [
    "午后的共用茶壶",
    "天气转凉，来镇厅办事的老人习惯捧一只空杯暖手。厨娘妮娜看见后，愿每日下午烧一壶白水，放在门边内侧，避免挡路。她特地说明不是茶会，也不要求任何人夸她的水好喝。请准借出一只带盖陶壶，喝完的人把杯子洗净归位。",
    "借出陶壶供应午后热水",
    "先试行三日再定存放处",
    "用小壶勤换，避免水放太久",
    "请陶匠捐一只旧壶并验好壶嘴",
  ],
  [
    "风吹翻的空白纸",
    "档案室开窗通风，一叠空白纸被吹到院里。书记官追出去时，有居民以为镇里正在分发新的规矩，郑重拿了一张回家。此刻空白纸已经收回，窗也关得太紧。请准做两只朴素的压纸木镇，既能通风，也不用让全镇揣测白纸上的含义。",
    "制作两只压纸木镇",
    "借木匠边角料磨平使用",
    "改用带盖纸盒储存空白纸",
    "请学徒缝两只装砂布袋压纸",
  ],
];

export function currentDocument(state: GameState): Document {
  if (state.current.startsWith("season/")) {
    const n = Number(state.current.split("/")[1]);
    const [title, body, request, a, b, c] =
      seasonalRequests[n % seasonalRequests.length];
    return {
      id: state.current,
      title,
      sender: "镇厅书记官露西安",
      body: [body],
      results: {
        approve: `您准许${request}，书记官已照办。`,
        reject: `您正式拒绝${request}，书记官改以现有物件应付。`,
        defer: `有关${request}的申请没有收到回复，原物暂留待用。`,
      },
      replies: [a, b, c].map((text) => ({
        text: `${text}。`,
        result: `书记官依批示办妥：${text}。`,
      })),
    };
  }
  const catalog = catalogAt(state.catalogRevision);
  const source = documents[state.current];
  const contract = catalog.letters[state.current];
  if (!source || !contract) throw new Error(`Unknown document: ${state.current}`);
  const doc = { ...source, ...contract };
  const previous = doc.chain ? state.facts[doc.chain] : undefined;
  if (previous && catalog.chains.find(c => c.id === doc.chain)?.quotePrevious !== false &&
      state.current.endsWith("/reply")) {
    return { ...doc, body: [previous.lastResult, ...doc.body] };
  }
  return doc;
}

/** Stable ID ranking: inserting an unrelated item does not reshuffle every candidate. */
export function rank(id: string, seed: number) {
  let h = seed | 0;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h ^= h >>> 16;
  return h >>> 0;
}

export function eligibleDay(id: string, s: GameState): number {
  const contract = catalogAt(s.catalogRevision).letters[id];
  if (!contract) return Infinity;
  const gate = contract.requires;
  if (!gate) return 1;
  const source = s.history.find(h => h.id === gate.id);
  return source && gate.actions.includes(source.action) ? source.day + gate.days : Infinity;
}

function selectNext(s: GameState) {
  const {chains, letters, standaloneIds} = catalogAt(s.catalogRevision);
  // One new cast member per day, with overdue follow-ups taking the remaining slots.
  const starter = chains.find((c, i) => i < s.day && !s.started.includes(c.id) && eligibleDay(`${c.id}/start`,s) <= s.day);
  if (starter && s.inDay === 0) {
    s.started.push(starter.id);
    s.current = `${starter.id}/start`;
    return;
  }
  const due = s.pending
    .filter((p) => p.due <= s.day)
    .sort((a, b) => a.due - b.due || a.order - b.order)[0];
  if (due) {
    s.pending = s.pending.filter((p) => p.id !== due.id);
    s.current = due.id;
    return;
  }
  const read = new Set(s.readDaily);
  const unread = standaloneIds.filter(id => !read.has(id));
  const available = unread.filter(id => eligibleDay(id, s) <= s.day)
    // Rank once per candidate rather than re-hashing both IDs on every comparison.
    .map(id => ({id, rank: rank(id, s.seed)}))
    .sort((a, b) => a.rank - b.rank || a.id.localeCompare(b.id))
    .map(candidate => candidate.id);
  if (available.length) {
    // Prefer a different sender and form when several letters can arrive today.
    const previous = letters[s.history.at(-1)?.id ?? ""];
    const id = available.find(id => letters[id].sender !== previous?.sender &&
      (letters[id].kind ?? "letter") !== (previous?.kind ?? "letter")) ?? available[0];
    s.readDaily.push(id);
    s.current = id;
    return;
  }
  // Do not replay old letters to fill a gap. Let the printed date move to the next arrival.
  const future = Math.min(
    ...s.pending.map((p) => p.due),
    ...unread.map(id => eligibleDay(id, s)),
    ...chains.map((c,i)=>s.started.includes(c.id) ? Infinity : Math.max(i+1,eligibleDay(`${c.id}/start`,s))),
  );
  if (Number.isFinite(future)) {
    s.day = Math.max(s.day + 1, future);
    s.inDay = 0;
    selectNext(s);
    return;
  }
  s.current = `season/${s.seasonal++}`;
}

export function decide(
  state: GameState,
  expectedId: string,
  action: Action,
  reply?: number,
  nextRevision = latestCatalogRevision,
): GameState {
  if (!Number.isInteger(nextRevision) || nextRevision < state.catalogRevision || nextRevision > latestCatalogRevision) return state;
  if (
    state.current !== expectedId ||
    state.history.some((h) => h.id === expectedId)
  )
    return state;
  if (!["approve", "reject", "defer", "written_reply"].includes(action))
    return state;
  const doc = currentDocument(state);
  if (
    action === "written_reply" &&
    (!Number.isInteger(reply) || reply! < 0 || !doc.replies[reply!])
  )
    return state;
  const result =
    action === "written_reply"
      ? doc.replies[reply!].result
      : doc.results[action];
  // History entries are immutable. Avoid cloning the entire transcript on every choice.
  const s: GameState = { ...state, catalogRevision: nextRevision, history: [...state.history],
    pending: [...state.pending], started: [...state.started],
    readDaily: [...state.readDaily], facts: { ...state.facts } };
  s.history.push({
    id: expectedId,
    day: s.day,
    action,
    ...(action === "written_reply" ? { reply } : {}),
    result,
    nextCatalogRevision: nextRevision,
  });
  if (doc.chain) {
    const branch: Branch = action === "written_reply" ? "reply" : action;
    s.facts[doc.chain] = {
      branch: s.facts[doc.chain]?.branch ?? branch,
      lastResult: result,
      lastDay: s.day,
    };
    const suffix =
      doc.stage === 1
        ? branch
        : doc.stage === 2
          ? "continuation"
          : doc.stage === 3
            ? "finale"
            : null;
    if (suffix)
      s.pending.push({
        id: `${doc.chain}/${suffix}`,
        due: s.day + (catalogAt(state.catalogRevision).chains.find(c => c.id === doc.chain)?.delays?.[doc.stage! - 1] ?? 2),
        order: s.history.length,
      });
  }
  s.inDay++;
  if (s.inDay >= 4) {
    s.day++;
    s.inDay = 0;
  }
  selectNext(s);
  return s;
}

export function dateLabel(day: number) {
  const months = ["秋月", "霜月", "雪月", "芽月", "花月", "暖月"];
  const n = ((day + 4) % 30) + 1;
  const digits = "零一二三四五六七八九";
  const number =
    n < 10
      ? digits[n]
      : n === 10
        ? "十"
        : (n < 20 ? "十" : digits[Math.floor(n / 10)] + "十") +
          (n % 10 ? digits[n % 10] : "");
  const year = Math.floor((day + 4) / 180) + 1;
  const yearNumber = year < 10 ? digits[year] : year < 20 ? `十${year % 10 ? digits[year % 10] : ''}` : year < 100 ? `${digits[Math.floor(year / 10)]}十${year % 10 ? digits[year % 10] : ''}` : String(year);
  return `${year > 1 ? `第${yearNumber}年·` : ''}${months[Math.floor((day + 4) / 30) % months.length]}第${number}日`;
}
