import test from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import { validateMarkup } from "./validator";

await test("it validates a valid html", async () => {
  const validHTML = await fs.readFile("../../fixtures/valid.html", "utf-8");
  const [violations, summary] = await validateMarkup(validHTML);
  assert.equal(violations.length, 0);
  assert.equal(summary.length, 0);
});

await test("it reports violations for an invalid html", async () => {
  const invalidHTML = await fs.readFile("../../fixtures/invalid.html", "utf-8");
  const [violations, summary] = await validateMarkup(invalidHTML);
  assert(violations.length > 0);
  assert(summary.length > 0);
});
