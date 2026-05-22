import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.resolve(__dirname, '../../test-fixtures/scoring');

const fixtures = fs
  .readdirSync(FIXTURES_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: f, body: JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, f), 'utf8')) }));

for (const { file, body } of fixtures) {
  test(`engine: ${file}: ${body.name}`, async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(async (input) => {
      const mod = await import('/src/lib/engine/composite-grader.ts');
      return mod.gradeObjective(input);
    }, body.input);
    expect(result.computedCompositeRag).toBe(body.expected.computedCompositeRag);
    expect(result.flags.map((f: any) => f.flagCode).sort()).toEqual(
      body.expected.expectedFlags.map((f: any) => f.flagCode).sort(),
    );
  });
}
