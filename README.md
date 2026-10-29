<h1 align="center">✉️ DEAR MAYOR</h1>

<p align="center">
  <a href="https://seiya058904.github.io/Dear-Mayor/">
    <img src="docs/media/readme-cover.svg" width="100%" alt="Illustrated cream letter paper, a wax seal and a pen for Dear Mayor, a quiet game about answering a small town." />
  </a>
</p>

<p align="center">
  <strong>Every letter asks for an answer. Every answer leaves a trace.</strong>
</p>

<p align="center">
  A quiet, illustrated town-hall game about reading letters, making decisions,<br />
  and discovering what those decisions mean to the people who wrote them.
</p>

<p align="center">
  <a href="https://seiya058904.github.io/Dear-Mayor/"><strong>▶ Play in Your Browser</strong></a>
  &nbsp;·&nbsp;
  <a href="#how-it-works">✒️ How It Works</a>
  &nbsp;·&nbsp;
  <a href="#a-closer-look">🖼️ Screenshots</a>
  &nbsp;·&nbsp;
  <a href="#play-or-run-locally">⚙️ Run Locally</a>
</p>

<p align="center">
  <sub>1,160 AUTHORED NODES &nbsp;·&nbsp; 82 STORYLINES &nbsp;·&nbsp; 860 LETTERS PER RUN &nbsp;·&nbsp; NO SCORE TO CHASE</sub>
</p>

<p align="center">
  <a href="https://github.com/seiya058904/Dear-Mayor/actions/workflows/pages.yml">
    <img src="https://github.com/seiya058904/Dear-Mayor/actions/workflows/pages.yml/badge.svg" alt="Build and deployment status" />
  </a>
</p>

<p align="center">
  <img src="docs/screenshots/desktop.png" width="840" alt="Actual Dear Mayor desktop gameplay: an illustrated wooden desk, a letter, and four decision cards" />
</p>

---

> **You are the mayor. But this is not a game about maximizing numbers.**
>
> A bridge needs repairs. The clockmaker has a complaint. Two neighbors cannot agree on what happened. Each morning brings another stack of letters, each written by someone who expects you to do something.
>
> You have limited information, no perfect answer, and no immediate score. Sometimes, days later, the same person writes back.

<a id="how-it-works"></a>
## ✒️ One Letter at a Time

<p align="center"><code>READ THE LETTER &nbsp;→&nbsp; MAKE A DECISION &nbsp;→&nbsp; TURN THE DAY &nbsp;→&nbsp; SEE WHAT FOLLOWS</code></p>

1. **Read.** Pay attention to the sender, their request, and what they might be leaving unsaid.
2. **Decide.** Approve, reject, leave the letter unanswered, or write a specific instruction.
3. **Move on.** New correspondence arrives as the days advance. Your earlier decisions remain part of the town's history.
4. **See the consequences.** Familiar people return with follow-up letters shaped by what you chose.

### Four Ways to Respond

| Decision | What it actually does |
| :--- | :--- |
| **Approve** | Grant the request in the letter. |
| **Reject** | Formally refuse the request. The sender receives a clear answer. |
| **Set Aside** | Take no action and send no reply. This is **not** a postponed item that returns to your inbox. |
| **Write an Instruction** | Choose one of three responses tailored to the current letter. |

Approval, rejection, silence, and specific instructions are tracked separately. The game does not display resource meters, moral ratings, quest logs, or a single "correct" choice.

## ✨ What Makes the Town Feel Alive

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>📜 1,160 Authored Nodes</h3>
      <p>Eighty-two branching storylines, 512 unconditional standalone letters, 72 mutually exclusive echo nodes, and two delayed return letters. The writing is authored and bundled with the game, not generated on demand.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🧩 Consequences That Return</h3>
      <p>Each storyline unfolds through four experienced stages. Eight relationships now carry exact memories of approval, refusal, silence, or each of the three instructions into a later letter.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🕰️ A Complete Season of Decisions</h3>
      <p>A full run contains 860 distinct authored letters, with four decisions per in-game day and date jumps when the next letter is due. After the main collection ends, four recurring letter types continue; these are excluded from the authored count.</p>
    </td>
    <td width="50%" valign="top">
      <h3>👥 Familiar Names, New Problems</h3>
      <p>Recurring senders and organizations, alongside occasional townspeople, give each response a chance to matter later.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🎨 An Illustrated Writing Desk</h3>
      <p>Warm daylight, layered paper, ink, and hand-drawn details frame the experience. Letter content is real, selectable browser text rather than text baked into a screenshot.</p>
    </td>
    <td width="50%" valign="top">
      <h3>💾 Save and Continue Offline</h3>
      <p>Progress is saved locally as you play. After the production site has fully cached its resources, the same browser can continue offline.</p>
    </td>
  </tr>
</table>

<a id="a-closer-look"></a>
## 🖼️ A Closer Look

<table>
  <tr>
    <td width="65%" align="center" valign="top">
      <img src="docs/screenshots/reply.png" alt="Actual desktop screenshot showing the expanded instruction note" />
      <br />
      <sub>Make the decision your own with a letter-specific instruction.</sub>
      <div align="left">
        <h4>✒️ Inside the Reply</h4>
        <p><strong>01 · Make it specific.</strong><br />
        Open the note to reveal three responses written for the current letter—not a generic dialogue menu.</p>
        <p><strong>02 · Decide when you're ready.</strong><br />
        Read the options or close the note without committing. The decision is recorded only when you select a response.</p>
        <p><strong>03 · Let the town answer back.</strong><br />
        Your instruction becomes part of the story. Later letters can reflect what happened because of it.</p>
      </div>
    </td>
    <td width="35%" align="center" valign="top">
      <img src="docs/screenshots/mobile.png" alt="Actual mobile screenshot showing a portrait letter and touch-friendly decision cards" />
      <br />
      <sub>Read and respond on a smaller screen.</sub>
    </td>
  </tr>
</table>

These screenshots show the current built game in Chromium. The desktop composition is based on a 1672 × 941 reference layout. Narrow screens use flowing paper with readable text and room around its decoration. This adaptation does not claim pixel-perfect reproduction.

<a id="play-or-run-locally"></a>
## 🚀 Play or Run Locally

### 🌐 Play Online

**[Open Dear Mayor →](https://seiya058904.github.io/Dear-Mayor/)**

The game is published through GitHub Pages. No account, installation, online AI service, or external game server is required. The game interface and letters are currently in **Simplified Chinese**; this README is in English for repository visitors.

### 💻 Run from Source

Requires **Node.js 24** and npm. From the repository root:

~~~bash
npm ci
npm run dev
~~~

Open **http://127.0.0.1:5173/**.

> **Expanded catalog:** the source contains **1,160 authored nodes**, with **860 distinct letters reachable in one run**. Check the workflow for deployment status; source synchronization alone does not confirm the live site is updated. See the [expansion progress](docs/EXPANSION-PROGRESS.md), [content inventory](docs/CONTENT-COVERAGE.md), and [QA evidence](docs/QA.md).

<details>
<summary><strong>Build, verification, and technical details</strong></summary>

~~~bash
npm run check                # TypeScript and engine regression tests
npm run build                # Production build, including the offline service worker
npx playwright install chromium
npm run test:e2e             # Browser interaction and offline tests
npm run content:report       # Regenerate the current catalog inventory
npm run content:impact       # Compare visible causal coverage with catalog 21
npm run preview              # Preview the production build
~~~

**React 19 · TypeScript · Vite 8 · Playwright**

The production build is written to `dist/`. Runtime content, fonts, and artwork ship with the game. There is no authentication backend, analytics SDK, or runtime CDN dependency.

Changes covered by the [verification and GitHub Pages workflow](https://github.com/seiya058904/Dear-Mayor/actions/workflows/pages.yml) are checked before deployment from `main`; README and cover-only changes are excluded. Check the workflow for current deployment status.

</details>

## 💾 Your Progress Stays in Your Browser

Progress is stored locally for the **current browser and site origin**. The hosted game, the local development server, and different browser profiles do not share saves automatically.

- Clearing site data may erase your progress. There is no cloud sync or cross-device save transfer.
- **Restart Season** replaces the current run only after confirmation.
- If an unreadable save cannot be backed up, its original text stays protected until you explicitly discard it. The recovery dialog also offers an export.
- Updates preserve the wording and options of the letter already on your desk. Newly added callbacks apply to new runs with compatible content rules.
- Offline continuation requires a successful initial load and complete resource caching in the production build.
- If another tab saves newer progress, this page stops saving and offers **Load Latest Progress**. Continue from the updated run instead of keeping two active copies. Saving requires a browser with the Web Locks API, available on the HTTPS site and supported localhost browsers.

## 🛠️ Repository Guide

~~~text
src/content/       Letters, recurring characters, branching stories, outcomes
src/game/          Scheduling, decisions, saving, and validation
src/components/    Desk presentation, letter UI, and instruction notes
public/art/        Illustrated interface assets
public/fonts/      Locally bundled typeface and license
tests/             Engine, persistence, browser, and offline coverage
docs/              Content rules, design decisions, assets, and QA evidence
~~~

For contributors and future iterations:

- [Content and save contracts](docs/CONTENT.md) · [Design decisions](docs/DECISIONS.md) · [Repository guidance](AGENTS.md)
- [Art and asset provenance](docs/ASSETS.md) · [Test and release evidence](docs/QA.md)
- [Post-V6 audit](docs/POST-V6-AUDIT.md) · [Visible causal coverage](docs/CONTENT-IMPACT.md)

## 📖 Assets and Usage

The illustrated interface uses supplied artwork and derivative paper assets. The bundled typeface is [LXGW WenKai Lite](https://github.com/lxgw/LxgwWenKai-Lite), distributed under the accompanying [SIL Open Font License](public/fonts/OFL.txt).

This repository does **not** declare a blanket license covering its code, writing, and visual assets. Public access alone should not be interpreted as permission to redistribute or relicense them. Refer to the [asset documentation](docs/ASSETS.md) for provenance and details.

---

<p align="center">
  <sub>THE TOWN DOESN'T SEND YOU A SCORE. IT SENDS ANOTHER LETTER.</sub><br />
  <sub>Dear Mayor — a writing desk, a small town, and the consequences of a reply.</sub>
</p>
