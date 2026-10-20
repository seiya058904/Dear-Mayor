import type { Letter } from "../game/types";

export function letter(
  title: string,
  body: string,
  yes: string,
  no: string,
  silence: string,
  replies: [string, string][],
  sender?: string,
): Letter {
  return {
    title,
    body: body.split("\n"),
    results: { approve: yes, reject: no, defer: silence },
    replies: replies.map(([text, result]) => ({ text, result })),
    ...(sender ? { sender } : {}),
  };
}
