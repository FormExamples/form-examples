import { describe, expect, it } from 'vitest';
import { emptyAdrFormData } from '#lib/types.js';
import { buildMarkdown } from './build-markdown.js';

describe('buildMarkdown', () => {
  it('renders a minimal ADR with placeholders for empty sections', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'Use PostgreSQL';
    const md = buildMarkdown(data);

    expect(md).toMatch(/^# NNNN — Use PostgreSQL/);
    expect(md).toMatch(/- \*\*Status:\*\* pending/);
    expect(md).toMatch(/## Issue\n_TBD_/);
    expect(md).toMatch(/## Decision\n_TBD_/);
    expect(md).toContain('## Positions');
    expect(md).toContain('_None._');
    expect(md).toContain('## Notes');
  });

  it('zero-pads the ADR number to four digits', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'X';
    data.adr.number = '42';
    expect(buildMarkdown(data)).toMatch(/^# 0042 — X/);
  });

  it('renders author email and role only when present', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'X';
    data.author.name = 'Lin Chen';
    data.author.email = 'lin@example.com';
    data.author.role = 'architect';
    const md = buildMarkdown(data);
    expect(md).toContain('- **Author:** Lin Chen <lin@example.com> (architect)');

    data.author.email = '';
    data.author.role = '';
    expect(buildMarkdown(data)).toContain('- **Author:** Lin Chen\n');
  });

  it('renders positions with chosen marker and pros/cons bullets', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'X';
    data.positions = [
      {
        name: 'Use PostgreSQL',
        description: 'Relational primary store.',
        modelOrDiagramUrl: '',
        isChosen: true,
        pros: 'mature\nACID',
        cons: 'no native JSON joins'
      },
      {
        name: 'Use MongoDB',
        description: '',
        modelOrDiagramUrl: '',
        isChosen: false,
        pros: '',
        cons: ''
      }
    ];
    const md = buildMarkdown(data);

    expect(md).toContain('### 1. Use PostgreSQL  ✓ chosen');
    expect(md).toContain('Relational primary store.');
    expect(md).toContain('**Pros:**');
    expect(md).toContain('- mature');
    expect(md).toContain('- ACID');
    expect(md).toContain('**Cons:**');
    expect(md).toContain('### 2. Use MongoDB');
    expect(md).not.toMatch(/### 2\. Use MongoDB\s+✓/);
  });

  it('renders related-* lists as bullets, skipping blank lines', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'X';
    data.adr.relatedDecisions = 'ADR 0017\n\n  ADR 0023  \n';
    const md = buildMarkdown(data);

    expect(md).toContain('## Related Decisions\n- ADR 0017\n- ADR 0023\n');
  });

  it('renders notes timestamped with author', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'X';
    data.notes = [
      { notedAt: '2026-05-08T10:00:00Z', notedBy: 'Lin Chen', body: 'Aligned with platform.' },
      { notedAt: '2026-05-09T11:30:00Z', notedBy: '',         body: 'Security review pending.' }
    ];
    const md = buildMarkdown(data);

    expect(md).toContain('- **2026-05-08T10:00:00Z** (Lin Chen): Aligned with platform.');
    expect(md).toContain('- **2026-05-09T11:30:00Z** (unknown): Security review pending.');
  });

  it('emits a sign-off footer only when signedOffBy is set', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'X';
    expect(buildMarkdown(data)).not.toContain('Signed off by');

    data.adr.signedOffBy = 'Lin Chen';
    data.adr.signedOffAt = '2026-05-15T09:00:00Z';
    const md = buildMarkdown(data);
    expect(md).toContain('---\nSigned off by Lin Chen on 2026-05-15T09:00:00Z.');
  });

  it('falls back to (unnamed) when a position name is blank', () => {
    const data = emptyAdrFormData();
    data.adr.title = 'X';
    data.positions = [
      { name: '', description: '', modelOrDiagramUrl: '', isChosen: false, pros: '', cons: '' }
    ];
    expect(buildMarkdown(data)).toContain('### 1. (unnamed)');
  });
});
