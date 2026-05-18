import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildMarkdown } from './build-markdown.js';
import { parseMarkdown } from './parse-markdown.js';

// Resolve doc/0001-...md relative to this test file. The example ADR lives in
// the form's `doc/` directory and is intentionally written in the canonical
// Markdown format `buildMarkdown` emits, so a parse-then-emit round-trip
// should produce semantically identical output. We compare *parsed* states
// rather than raw strings because the emitter normalises whitespace.
const __dirname = dirname(fileURLToPath(import.meta.url));
const EXAMPLE_ADR_PATH = join(__dirname, '..', '..', '..', '..', 'doc', '0001-use-tyree-and-akerman-template.md');

describe('round-trip of doc/0001-use-tyree-and-akerman-template.md', () => {
  it('parses the example ADR cleanly', () => {
    const md = readFileSync(EXAMPLE_ADR_PATH, 'utf8');
    const parsed = parseMarkdown(md);

    expect(parsed.adr.title).toBe('Use the Tyree & Akerman template for ADRs in this repo');
    expect(parsed.adr.number).toBe('1');
    expect(parsed.adr.status).toBe('approved');
    expect(parsed.adr.decisionGroup).toBe('governance');
    expect(parsed.adr.decisionDate).toBe('2026-05-08');
    expect(parsed.author.name).toBe('Joel Parker Henderson');
    expect(parsed.author.email).toBe('joel@joelparkerhenderson.com');
    expect(parsed.author.role).toBe('architect');
    expect(parsed.organization.name).toBe('formexamples/form-examples');
    expect(parsed.positions).toHaveLength(3);
    expect(parsed.positions[2].isChosen).toBe(true);
    expect(parsed.notes).toHaveLength(3);
    expect(parsed.adr.signedOffBy).toBe('Joel Parker Henderson');
  });

  it('round-trips parse → emit → parse to the same parsed state', () => {
    const md = readFileSync(EXAMPLE_ADR_PATH, 'utf8');
    const first = parseMarkdown(md);
    const reemitted = buildMarkdown(first);
    const second = parseMarkdown(reemitted);

    expect(second.adr).toEqual(first.adr);
    expect(second.author).toEqual(first.author);
    expect(second.organization).toEqual(first.organization);
    expect(second.positions).toEqual(first.positions);
    expect(second.notes).toEqual(first.notes);
  });

  it('preserves all three positions with chosen flag exactly on one', () => {
    const md = readFileSync(EXAMPLE_ADR_PATH, 'utf8');
    const parsed = parseMarkdown(md);

    const chosen = parsed.positions.filter((p) => p.isChosen);
    expect(chosen).toHaveLength(1);
    expect(chosen[0].name).toContain('Tyree');
  });

  it('preserves pros/cons bullet counts for the chosen position', () => {
    const md = readFileSync(EXAMPLE_ADR_PATH, 'utf8');
    const parsed = parseMarkdown(md);

    const chosen = parsed.positions.find((p) => p.isChosen)!;
    expect(chosen.pros.split('\n').filter(Boolean)).toHaveLength(4);
    expect(chosen.cons.split('\n').filter(Boolean)).toHaveLength(3);
  });

  it('preserves all four related-* sections as line-separated text', () => {
    const md = readFileSync(EXAMPLE_ADR_PATH, 'utf8');
    const parsed = parseMarkdown(md);

    expect(parsed.adr.relatedDecisions.split('\n').filter(Boolean)).toHaveLength(3);
    expect(parsed.adr.relatedRequirements.split('\n').filter(Boolean)).toHaveLength(3);
    expect(parsed.adr.relatedArtifacts.split('\n').filter(Boolean)).toHaveLength(3);
    expect(parsed.adr.relatedPrinciples.split('\n').filter(Boolean)).toHaveLength(4);
  });
});
