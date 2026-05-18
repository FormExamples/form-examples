import { emptyAdrFormData, type AdrFormData, type Status, type DecisionGroup } from '$lib/types.js';

const VALID_STATUSES: Status[] = ['pending', 'decided', 'approved', 'superseded', 'deprecated'];
const VALID_GROUPS: DecisionGroup[] = [
  '', 'business', 'data', 'integration', 'presentation',
  'security', 'infrastructure', 'operations', 'governance', 'other'
];

function asStatus(s: string): Status | null {
  return (VALID_STATUSES as readonly string[]).includes(s) ? (s as Status) : null;
}

function asGroup(s: string): DecisionGroup | null {
  return (VALID_GROUPS as readonly string[]).includes(s) ? (s as DecisionGroup) : null;
}

/**
 * Parse a Markdown ADR in the canonical Tyree & Akerman format emitted by
 * `buildMarkdown` back into an `AdrFormData`. Unknown sections are ignored;
 * missing sections leave defaults in place. Mirrors the HTML form's
 * `parseMarkdown` so both wizards round-trip the same files.
 */
export function parseMarkdown(md: string): AdrFormData {
  const out = emptyAdrFormData();
  const lines = String(md).split('\n');

  for (const line of lines) {
    const m = line.match(/^#\s+(\S+)\s+—\s+(.+)$/);
    if (m) {
      if (/^\d+$/.test(m[1])) out.adr.number = String(parseInt(m[1], 10));
      out.adr.title = m[2].trim();
      break;
    }
    if (line.startsWith('# ')) {
      out.adr.title = line.slice(2).trim();
      break;
    }
  }

  for (const line of lines) {
    const meta = line.match(/^-\s+\*\*([^:]+):\*\*\s*(.*)$/);
    if (!meta) continue;
    const key = meta[1].toLowerCase();
    const val = meta[2].trim();
    if (key === 'status') {
      const s = asStatus(val);
      if (s) out.adr.status = s;
    } else if (key === 'group') {
      const g = asGroup(val);
      if (g !== null) out.adr.decisionGroup = g;
    } else if (key === 'date') {
      out.adr.decisionDate = val;
    } else if (key === 'organization') {
      out.organization.name = val;
    } else if (key === 'author') {
      const a = val.match(/^(.+?)(?:\s+<([^>]+)>)?(?:\s+\(([^)]+)\))?$/);
      if (a) {
        out.author.name = a[1].trim();
        if (a[2]) out.author.email = a[2];
        if (a[3]) {
          // Tolerate unknown roles by storing only known enum members.
          const role = a[3] as typeof out.author.role;
          out.author.role = role;
        }
      } else {
        out.author.name = val;
      }
    }
  }

  function collectSection(heading: string): string[] | null {
    const safe = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pat = new RegExp(`^##\\s+${safe}\\s*$`, 'i');
    let start = -1;
    for (let k = 0; k < lines.length; k++) {
      if (pat.test(lines[k])) {
        start = k + 1;
        break;
      }
    }
    if (start < 0) return null;
    const body: string[] = [];
    for (let k = start; k < lines.length; k++) {
      if (/^##\s/.test(lines[k]) || /^---\s*$/.test(lines[k])) break;
      body.push(lines[k]);
    }
    while (body.length && body[0].trim() === '') body.shift();
    while (body.length && body[body.length - 1].trim() === '') body.pop();
    return body;
  }

  function textOf(heading: string): string {
    const b = collectSection(heading);
    if (!b) return '';
    const t = b.join('\n').trim();
    return t === '_TBD_' || t === '_None._' ? '' : t;
  }

  function bulletsOf(heading: string): string {
    const b = collectSection(heading);
    if (!b) return '';
    const items: string[] = [];
    for (const line of b) {
      const m = line.match(/^-\s+(.*)$/);
      if (m) items.push(m[1].trim());
    }
    return items.join('\n');
  }

  out.adr.issue = textOf('Issue');
  out.adr.decision = textOf('Decision');
  out.adr.assumptions = textOf('Assumptions');
  out.adr.constraints = textOf('Constraints');
  out.adr.argument = textOf('Argument');
  out.adr.implications = textOf('Implications');
  out.adr.relatedDecisions = bulletsOf('Related Decisions');
  out.adr.relatedRequirements = bulletsOf('Related Requirements');
  out.adr.relatedArtifacts = bulletsOf('Related Artifacts');
  out.adr.relatedPrinciples = bulletsOf('Related Principles');

  const posBody = collectSection('Positions');
  if (posBody) {
    const positions: AdrFormData['positions'] = [];
    let current: AdrFormData['positions'][number] | null = null;
    for (let p = 0; p < posBody.length; p++) {
      const line = posBody[p];
      const head = line.match(/^###\s+\d+\.\s+(.+?)(\s+✓\s*chosen)?\s*$/);
      if (head) {
        if (current) positions.push(current);
        current = {
          name: head[1].trim(),
          description: '',
          modelOrDiagramUrl: '',
          isChosen: !!head[2],
          pros: '',
          cons: ''
        };
        continue;
      }
      if (!current) continue;
      const url = line.match(/^Model\/diagram:\s+<?([^>]+)>?$/);
      if (url) {
        current.modelOrDiagramUrl = url[1].trim();
        continue;
      }
      if (/^\*\*Pros:\*\*\s*$/i.test(line)) {
        const items: string[] = [];
        let q = p + 1;
        while (q < posBody.length && /^-\s+/.test(posBody[q])) {
          items.push(posBody[q].replace(/^-\s+/, '').trim());
          q++;
        }
        current.pros = items.join('\n');
        p = q - 1;
        continue;
      }
      if (/^\*\*Cons:\*\*\s*$/i.test(line)) {
        const items: string[] = [];
        let q = p + 1;
        while (q < posBody.length && /^-\s+/.test(posBody[q])) {
          items.push(posBody[q].replace(/^-\s+/, '').trim());
          q++;
        }
        current.cons = items.join('\n');
        p = q - 1;
        continue;
      }
      if (line.trim() === '' || line.trim() === '_None._') continue;
      current.description = (current.description ? current.description + '\n' : '') + line;
    }
    if (current) positions.push(current);
    if (positions.length > 0) out.positions = positions;
  }

  const noteBody = collectSection('Notes');
  if (noteBody) {
    const notes: AdrFormData['notes'] = [];
    for (const line of noteBody) {
      const m = line.match(/^-\s+\*\*([^*]+)\*\*\s*\(([^)]*)\):\s*(.*)$/);
      if (!m) continue;
      const by = m[2].trim();
      notes.push({
        notedAt: m[1].trim(),
        notedBy: by === 'unknown' ? '' : by,
        body: m[3].trim()
      });
    }
    out.notes = notes;
  }

  for (const line of lines) {
    const so = line.match(/^Signed off by\s+(.+?)(?:\s+on\s+(.+?))?\.?\s*$/);
    if (so) {
      out.adr.signedOffBy = so[1];
      if (so[2]) out.adr.signedOffAt = so[2];
      break;
    }
  }

  return out;
}
