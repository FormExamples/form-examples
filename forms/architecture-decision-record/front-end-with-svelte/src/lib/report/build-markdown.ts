import type { AdrFormData } from '#lib/types.js';

function bullets(text: string): string {
  const lines = String(text || '').split('\n').map((s) => s.trim()).filter(Boolean);
  if (lines.length === 0) return '_None._\n';
  return lines.map((l) => '- ' + l).join('\n') + '\n';
}

function pad4(n: string): string {
  if (!n) return 'NNNN';
  return String(n).padStart(4, '0');
}

export function buildMarkdown(data: AdrFormData): string {
  const a = data.adr;
  const au = data.author;
  const org = data.organization;

  const num = pad4(a.number);
  const heading = num + (a.title ? ' — ' + a.title : '');
  const lines: string[] = [];

  lines.push('# ' + heading, '');
  lines.push('- **Status:** ' + (a.status || 'pending'));
  if (a.decisionGroup) lines.push('- **Group:** ' + a.decisionGroup);
  if (a.decisionDate)  lines.push('- **Date:** ' + a.decisionDate);
  if (au.name)         lines.push('- **Author:** ' + au.name + (au.email ? ' <' + au.email + '>' : '') + (au.role ? ' (' + au.role + ')' : ''));
  if (org.name)        lines.push('- **Organization:** ' + org.name);
  lines.push('');

  lines.push('## Issue',          a.issue          || '_TBD_', '');
  lines.push('## Decision',       a.decision       || '_TBD_', '');
  lines.push('## Assumptions',    a.assumptions    || '_TBD_', '');
  lines.push('## Constraints',    a.constraints    || '_TBD_', '');

  lines.push('## Positions');
  if (data.positions.length === 0) {
    lines.push('_None._');
  } else {
    data.positions.forEach((p, i) => {
      lines.push('### ' + (i + 1) + '. ' + (p.name || '(unnamed)') + (p.isChosen ? '  ✓ chosen' : ''));
      if (p.description) lines.push(p.description);
      if (p.modelOrDiagramUrl) lines.push('Model/diagram: <' + p.modelOrDiagramUrl + '>');
      if (p.pros) { lines.push('', '**Pros:**', bullets(p.pros)); }
      if (p.cons) { lines.push('**Cons:**', bullets(p.cons)); }
      lines.push('');
    });
  }
  lines.push('');

  lines.push('## Argument',     a.argument     || '_TBD_', '');
  lines.push('## Implications', a.implications || '_TBD_', '');
  lines.push('## Related Decisions',    bullets(a.relatedDecisions));
  lines.push('## Related Requirements', bullets(a.relatedRequirements));
  lines.push('## Related Artifacts',    bullets(a.relatedArtifacts));
  lines.push('## Related Principles',   bullets(a.relatedPrinciples));

  lines.push('## Notes');
  if (data.notes.length === 0) {
    lines.push('_None._');
  } else {
    for (const n of data.notes) {
      lines.push('- **' + n.notedAt + '** (' + (n.notedBy || 'unknown') + '): ' + n.body);
    }
  }
  lines.push('');

  if (a.signedOffBy) {
    lines.push('---');
    lines.push('Signed off by ' + a.signedOffBy + (a.signedOffAt ? ' on ' + a.signedOffAt : '') + '.');
  }

  return lines.join('\n');
}
