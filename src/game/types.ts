export type Action = "approve" | "reject" | "defer" | "written_reply";
export type Branch = "approve" | "reject" | "defer" | "reply";
export type Reply = { text: string; result: string };
export type Letter = {
  /** Author metadata, never rendered as a game system. */
  kind?: "note" | "letter" | "official" | "archive";
  requires?: { id: string; actions: Action[]; days: number };
  title: string;
  body: string[];
  replies: Reply[];
  results: Record<"approve" | "reject" | "defer", string>;
  sender?: string;
  salutation?: string;
};
export type Chain = {
  id: string;
  sender: string;
  person: string;
  voice: string;
  delays?: [number, number, number];
  quotePrevious?: boolean;
  start: Letter;
  branches: Record<Branch, Letter>;
  continuation: Letter;
  finale: Letter;
};
export type Document = Letter & {
  id: string;
  sender: string;
  chain?: string;
  stage?: number;
};
export type Pending = { id: string; due: number; order: number };
export type Decision = {
  id: string;
  day: number;
  action: Action;
  reply?: number;
  result: string;
  /** Pool used to select the next letter; absent in v1/v2/v3 history. */
  nextCatalogRevision?: number;
};
export type GameState = {
  version: 2;
  contentVersion: 4;
  v3Length: number;
  /** Frozen engine for the pending letter at the initial migration boundary. */
  migrationVersion?: 1 | 2 | 3;
  initialCatalogRevision: number;
  catalogRevision: number;
  /** Boundary replayed with the frozen v2 engine, including any v1 prefix. */
  v2Length: number;
  /** Number of decisions replayed with the immutable v1 contract. */
  legacyLength: number;
  day: number;
  inDay: number;
  current: string;
  seed: number;
  history: Decision[];
  pending: Pending[];
  started: string[];
  readDaily: string[];
  facts: Record<
    string,
    { branch: Branch; lastResult: string; lastDay: number }
  >;
  seasonal: number;
};
