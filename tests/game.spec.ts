import { test, expect } from "@playwright/test";
import path from "node:path";
const key = "dear-mayor:save:v1";
test("real decisions, cancel, duplicate lock, reload, restart and 20 continuous letters", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("./");
  await expect(page).toHaveTitle("Dear Mayor · 小镇，请批示");
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator(".petition")
    .evaluate((e) => Promise.all(e.getAnimations().map((a) => a.finished)));
  await expect(page.locator("h1")).toHaveText("桥梁修缮请愿");
  if (process.env.QA_SCREENSHOTS)
    await page.screenshot({
      path: path.join(process.env.QA_SCREENSHOTS, "desktop.png"),
    });
  await page.getByRole("button", { name: "批示回复", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "提笔批示" })).toBeVisible();
  await page
    .locator(".reply-note")
    .evaluate((e) => Promise.all(e.getAnimations().map((a) => a.finished)));
  if (process.env.QA_SCREENSHOTS)
    await page.screenshot({
      path: path.join(process.env.QA_SCREENSHOTS, "reply.png"),
    });
  await page.getByRole("button", { name: "暂且收笔" }).click();
  await expect(page.locator("h1")).toHaveText("桥梁修缮请愿");
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBeNull();
  await page
    .getByRole("button", { name: "批准", exact: true })
    .dblclick({ delay: 30 });
  await expect(page.locator("article")).not.toHaveAttribute(
    "data-letter-id",
    "bridge/start",
  );
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).history.length,
      key,
    ),
  ).toBe(1);
  const nextId = await page.locator("article").getAttribute("data-letter-id");
  await page.reload();
  await expect(page.locator("article")).toHaveAttribute(
    "data-letter-id",
    nextId!,
  );
  for (let i = 1; i < 20; i++) {
    const before = await page.locator("article").getAttribute("data-letter-id");
    if (i % 4 === 3) {
      await page.getByRole("button", { name: "批示回复", exact: true }).click();
      await page
        .locator("[data-choice]")
        .nth(i % 3)
        .click();
    } else
      await page
        .getByRole("button", {
          name: ["批准", "不批准", "搁置"][i % 4],
          exact: true,
        })
        .click();
    await expect(page.locator("article")).not.toHaveAttribute(
      "data-letter-id",
      before!,
    );
    await expect(page.locator(".decisions")).toHaveAttribute(
      "aria-busy",
      "false",
    );
  }
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).history.length,
      key,
    ),
  ).toBe(20);
  await page.getByRole("button", { name: "重启一季" }).click();
  await page.getByRole("button", { name: "继续批阅" }).click();
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).history.length,
      key,
    ),
  ).toBe(20);
  await page.getByRole("button", { name: "重启一季" }).click();
  await page.getByRole("button", { name: "确认重启" }).click();
  await expect(page.locator("h1")).toHaveText("桥梁修缮请愿");
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).history.length,
      key,
    ),
  ).toBe(0);
  expect(errors).toEqual([]);
});
for (const viewport of [
  { width: 390, height: 844 },
  { width: 360, height: 740 },
  { width: 1366, height: 768 },
]) {
  test(`readable layout and keyboard replies ${viewport.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".letter-reading")
        .evaluate((e) => e.scrollHeight <= e.clientHeight + 2),
    ).toBe(true);
    const controls = page.locator(".decision");
    for (let i = 0; i < 4; i++) {
      const box = await controls.nth(i).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    if (process.env.QA_SCREENSHOTS)
      await page.screenshot({
        path: path.join(
          process.env.QA_SCREENSHOTS,
          `${viewport.width === 1366 ? "laptop" : "mobile-" + viewport.width}.png`,
        ),
        fullPage: true,
      });
    await page.getByRole("button", { name: "批示回复", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-choice="0"]')).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "暂且收笔" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "批示回复", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await page.locator('[data-choice="1"]').click();
    await expect(page.locator("article")).not.toHaveAttribute(
      "data-letter-id",
      "bridge/start",
    );
    await expect(page.locator("h1")).toBeFocused();
  });
}
test("production service worker permits offline refresh and next decision", async ({
  page,
  context,
}) => {
  const failed: string[] = [];
  page.on("requestfailed", (r) =>
    failed.push(`${r.url()}: ${r.failure()?.errorText}`),
  );
  page.on("pageerror", (e) => failed.push(e.message));
  await page.goto("./");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    )
    .toBe(true);
  await page.getByRole("button", { name: "不批准", exact: true }).click();
  await expect(page.locator("article")).not.toHaveAttribute(
    "data-letter-id",
    "bridge/start",
  );
  const before = await page.locator("article").getAttribute("data-letter-id");
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("article"), failed.join("\n")).toHaveAttribute(
    "data-letter-id",
    before!,
  );
  await page.getByRole("button", { name: "搁置", exact: true }).click();
  await expect(page.locator("article")).not.toHaveAttribute(
    "data-letter-id",
    before!,
  );
  expect(
    await page
      .locator(".paper-art")
      .evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0),
  ).toBe(true);
});
