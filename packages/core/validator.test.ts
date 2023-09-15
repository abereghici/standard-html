import test from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import { createValidator } from "./validator";

await test("it validates a valid html", async () => {
  const validator = createValidator();
  const validHTML = await fs.readFile("../../fixtures/valid.html", "utf-8");
  const violations = await validator.validate(validHTML);
  assert.equal(violations.length, 0);
});

await test("it reports violations for an invalid html", async () => {
  const validator = createValidator();
  const invalidHTML = await fs.readFile("../../fixtures/invalid.html", "utf-8");
  const violations = await validator.validate(invalidHTML);
  assert(violations.length > 0);
});
