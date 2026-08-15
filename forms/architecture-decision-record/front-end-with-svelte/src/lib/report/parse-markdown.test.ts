import { describe, expect, it } from 'vitest';
import { buildMarkdown } from './build-markdown.js';
import { parseMarkdown } from './parse-markdown.js';
import { emptyAdrFormData } from '#lib/types.js';

describe('parseMarkdown', () => {
  it('round-trips a full ADR through buildMarkdown', () => {
    const original = emptyAdrFormData();
    original.adr.title = 'Use PostgreSQL';
    original.adr.number = '42';
    original.adr.status = 'approved';
    original.adr.decisionGroup = 'data';
    original.adr.decisionDate = '2026-05-15';
    original.adr.issue = 'We need a primary OLTP datastore.';
    original.adr.decision = 'Use PostgreSQL 16.';
    original.adr.constraints = 'Managed cloud offering only.';
    original.adr.argument = 'Mature, team familiarity, ACID.';
    original.adr.relatedDecisions = 'ADR 0017 — Event sourcing\nADR 0023 — CQRS';
    original.adr.relatedPrinciples = 'P-01 — Prefer managed services';
    original.author.name = 'Lin Chen';
    original.author.email = 'lin@example.com';
    original.author.role = 'architect';
    original.organization.name = 'Acme Corp';
    original.positions = [
      {
        name: 'Use PostgreSQL',
        description: 'Relational primary store.',
        modelOrDiagramUrl: 'https://example.com/diagram.png',
        isChosen: true,
        pros: 'mature\nACID',
        cons: 'no native JSON joins'
      },
      {
        name: 'Use MongoDB',
        description: 'Document store.',
        modelOrDiagramUrl: '',
        isChosen: false,
        pros: '',
        cons: ''
      }
    ];
    original.notes = [
      { notedAt: '2026-05-08T10:00:00Z', notedBy: 'Lin Chen', body: 'Aligned with platform.' },
      { notedAt: '2026-05-09T11:30:00Z', notedBy: '',         body: 'Security review pending.' }
    ];
    original.adr.signedOffBy = 'Lin Chen';
    original.adr.signedOffAt = '2026-05-15T09:00:00Z';

    const md = buildMarkdown(original);
    const parsed = parseMarkdown(md);

    expect(parsed.adr.number).toBe('42');
    expect(parsed.adr.title).toBe('Use PostgreSQL');
    expect(parsed.adr.status).toBe('approved');
    expect(parsed.adr.decisionGroup).toBe('data');
    expect(parsed.adr.decisionDate).toBe('2026-05-15');
    expect(parsed.adr.issue).toBe('We need a primary OLTP datastore.');
    expect(parsed.adr.decision).toBe('Use PostgreSQL 16.');
    expect(parsed.adr.constraints).toBe('Managed cloud offering only.');
    expect(parsed.adr.argument).toBe('Mature, team familiarity, ACID.');
    expect(parsed.adr.relatedDecisions).toBe('ADR 0017 — Event sourcing\nADR 0023 — CQRS');
    expect(parsed.adr.relatedPrinciples).toBe('P-01 — Prefer managed services');
    expect(parsed.author.name).toBe('Lin Chen');
    expect(parsed.author.email).toBe('lin@example.com');
    expect(parsed.author.role).toBe('architect');
    expect(parsed.organization.name).toBe('Acme Corp');

    expect(parsed.positions).toHaveLength(2);
    expect(parsed.positions[0].name).toBe('Use PostgreSQL');
    expect(parsed.positions[0].isChosen).toBe(true);
    expect(parsed.positions[0].pros).toBe('mature\nACID');
    expect(parsed.positions[0].cons).toBe('no native JSON joins');
    expect(parsed.positions[0].modelOrDiagramUrl).toBe('https://example.com/diagram.png');
    expect(parsed.positions[1].isChosen).toBe(false);
    expect(parsed.positions[1].description).toBe('Document store.');

    expect(parsed.notes).toHaveLength(2);
    expect(parsed.notes[0]).toEqual({
      notedAt: '2026-05-08T10:00:00Z',
      notedBy: 'Lin Chen',
      body: 'Aligned with platform.'
    });
    expect(parsed.notes[1].notedBy).toBe(''); // "unknown" collapses to ''

    expect(parsed.adr.signedOffBy).toBe('Lin Chen');
    expect(parsed.adr.signedOffAt).toBe('2026-05-15T09:00:00Z');
  });

  it('returns empty defaults for empty input', () => {
    const parsed = parseMarkdown('');
    expect(parsed.adr.title).toBe('');
    expect(parsed.adr.status).toBe('pending');
    expect(parsed.positions).toHaveLength(1);
    expect(parsed.notes).toHaveLength(0);
  });

  it('rejects unknown status enums (keeps default)', () => {
    const md = '# 0001 — X\n\n- **Status:** provisional\n';
    const parsed = parseMarkdown(md);
    expect(parsed.adr.status).toBe('pending');
  });
});
