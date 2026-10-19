export type Action = "approve" | "reject" | "defer" | "written_reply";
export type Branch = "approve" | "reject" | "defer" | "reply";
export type Reply = { text: string; result: string };
export type Letter = {
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
};
export type GameState = {
  version: 1;
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
