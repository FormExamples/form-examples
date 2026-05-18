<script lang="ts">
  import {
    pairSubmissions,
    quadrantDescription,
    quadrantLabel,
    readSisterCsv,
    type ComparisonPair,
    type Quadrant,
    type SisterRow,
  } from '$lib/comparison.js';

  type Status = { kind: 'ok' | 'warn'; message: string } | null;

  let principlesRows = $state<SisterRow[]>([]);
  let behaviourRows = $state<SisterRow[]>([]);
  let principlesName = $state('');
  let behaviourName = $state('');
  let status = $state<Status>(null);

  const pairs = $derived(pairSubmissions(principlesRows, behaviourRows));

  const totals = $derived.by<Record<Quadrant, number>>(() => {
    const t: Record<Quadrant, number> = {
      'healthy-adoption': 0,
      'aspirational-gap': 0,
      'cargo-cult': 0,
      'pre-agile': 0,
      'insufficient-data': 0,
    };
    for (const p of pairs) t[p.quadrant] += 1;
    return t;
  });

  function quadrantClass(q: Quadrant): string {
    switch (q) {
      case 'healthy-adoption':
        return 'bg-emerald-50 border-emerald-600 text-emerald-900';
      case 'aspirational-gap':
        return 'bg-yellow-50 border-yellow-600 text-yellow-900';
      case 'cargo-cult':
        return 'bg-orange-50 border-orange-600 text-orange-900';
      case 'pre-agile':
        return 'bg-red-50 border-red-600 text-red-900';
      case 'insufficient-data':
        return 'bg-slate-50 border-slate-500 text-slate-800';
    }
  }

  function rowClass(q: Quadrant): string {
    switch (q) {
      case 'healthy-adoption':
        return 'bg-emerald-50';
      case 'aspirational-gap':
        return 'bg-yellow-50';
      case 'cargo-cult':
        return 'bg-orange-50';
      case 'pre-agile':
        return 'bg-red-50';
      case 'insufficient-data':
        return 'bg-slate-50';
    }
  }

  function readFile(
    ev: Event,
    target: 'principles' | 'behaviour',
  ): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = readSisterCsv(String(reader.result ?? ''));
        if (target === 'principles') {
          principlesRows = parsed;
          principlesName = file.name;
        } else {
          behaviourRows = parsed;
          behaviourName = file.name;
        }
        status = {
          kind: 'ok',
          message: `Loaded ${parsed.length} rows from ${file.name}.`,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'parse error';
        status = { kind: 'warn', message: `Import failed: ${msg}` };
      } finally {
        input.value = '';
      }
    };
    reader.onerror = () => {
      status = { kind: 'warn', message: 'Could not read file.' };
    };
    reader.readAsText(file);
  }

  function clearAll() {
    principlesRows = [];
    behaviourRows = [];
    principlesName = '';
    behaviourName = '';
    status = null;
  }

  const QUADRANTS: Quadrant[] = [
    'healthy-adoption',
    'aspirational-gap',
    'cargo-cult',
    'pre-agile',
    'insufficient-data',
  ];

  function quadrantPairs(q: Quadrant): ComparisonPair[] {
    return pairs.filter((p) => p.quadrant === q);
  }

  function dotPosition(p: ComparisonPair): { x: number; y: number } | null {
    if (!p.principles || !p.behaviour) return null;
    const principlesScore = p.principles.score;
    const behaviourScore = p.behaviour.score;
    if (principlesScore === null || behaviourScore === null) return null;
    // Principles meanScore is 1-5; behaviour overallPercent is 0-100.
    // Map both to 0-100 for the grid.
    const px = ((principlesScore - 1) / 4) * 100;
    const py = behaviourScore;
    return { x: Math.max(0, Math.min(100, px)), y: Math.max(0, Math.min(100, py)) };
  }
</script>

<nav class="text-sm mb-4">
  <a href="/" class="text-brand-700 hover:underline">← Back to dashboard</a>
</nav>

<header class="mb-4">
  <h2 class="text-xl font-semibold">Principles vs. behaviour comparison</h2>
  <p class="text-sm text-slate-600 mt-1">
    Upload your team's
    <a
      href="../../agile-principles-assessment"
      class="text-brand-700 hover:underline"
    >agile-principles-assessment</a>
    CSV and your agile-checklist CSV. Teams are paired by
    <code>team + organisation</code>; for each pair we classify the team
    into one of four quadrants. See
    <a
      href="../../agile-checklist/doc/sister-form-comparison.md"
      class="text-brand-700 hover:underline"
    >sister-form-comparison.md</a> for the rationale.
  </p>
</header>

<section class="bg-white border border-slate-200 rounded p-4 mb-4">
  <h3 class="font-semibold mb-2">Upload</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm font-medium block mb-1">Principles assessment CSV</span>
      <input
        type="file"
        accept=".csv,text/csv"
        class="text-sm"
        onchange={(ev) => readFile(ev, 'principles')}
      />
      <p class="text-xs text-slate-500 mt-1">
        {principlesRows.length} rows · {principlesName || 'no file loaded'}
      </p>
    </label>
    <label class="block">
      <span class="text-sm font-medium block mb-1">Behaviour checklist CSV</span>
      <input
        type="file"
        accept=".csv,text/csv"
        class="text-sm"
        onchange={(ev) => readFile(ev, 'behaviour')}
      />
      <p class="text-xs text-slate-500 mt-1">
        {behaviourRows.length} rows · {behaviourName || 'no file loaded'}
      </p>
    </label>
  </div>
  {#if status}
    <p
      class="text-sm mt-3 {status.kind === 'ok' ? 'text-emerald-700' : 'text-red-700'}"
      role="status"
      aria-live="polite"
    >{status.message}</p>
  {/if}
  <button
    type="button"
    class="mt-3 px-3 py-1 text-sm border border-slate-300 rounded bg-white hover:bg-slate-100"
    onclick={clearAll}
  >Clear</button>
</section>

{#if pairs.length > 0}
  <section class="mb-4 grid grid-cols-2 md:grid-cols-5 gap-3">
    {#each QUADRANTS as q (q)}
      <div class="border-l-4 p-3 rounded {quadrantClass(q)}">
        <p class="text-xs uppercase tracking-wide">{quadrantLabel(q)}</p>
        <p class="text-2xl font-semibold">{totals[q]}</p>
      </div>
    {/each}
  </section>

  <section class="bg-white border border-slate-200 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">Quadrant grid</h3>
    <p class="text-xs text-slate-600 mb-2">
      X axis: principles maturity (1–5 mean). Y axis: behaviour maturity (0–100 % yes).
      Dotted lines mark the high-vs-low boundary (mature / 75 %).
    </p>
    <svg width="360" height="260" viewBox="0 0 360 260" role="img" aria-label="Quadrant grid">
      <!-- inner rect -->
      <rect x="40" y="20" width="280" height="200" fill="#f8fafc" stroke="#cbd5e1" />
      <!-- vertical and horizontal mid-lines at "high" thresholds -->
      <line x1={40 + (280 * 0.6875)} y1="20" x2={40 + (280 * 0.6875)} y2="220" stroke="#94a3b8" stroke-dasharray="3,3" />
      <line x1="40" y1={20 + (200 * 0.25)} x2="320" y2={20 + (200 * 0.25)} stroke="#94a3b8" stroke-dasharray="3,3" />
      <!-- axis labels -->
      <text x="180" y="240" text-anchor="middle" font-size="11" fill="#475569">Principles maturity →</text>
      <text x="20" y="120" text-anchor="middle" transform="rotate(-90,20,120)" font-size="11" fill="#475569">Behaviour maturity →</text>
      <!-- corner labels -->
      <text x="50" y="35" font-size="10" fill="#ea580c">cargo-cult</text>
      <text x="310" y="35" text-anchor="end" font-size="10" fill="#15803d">healthy</text>
      <text x="50" y="215" font-size="10" fill="#dc2626">pre-agile</text>
      <text x="310" y="215" text-anchor="end" font-size="10" fill="#ca8a04">aspirational</text>
      <!-- dots -->
      {#each pairs as p (p.team + '\x00' + p.organisation)}
        {@const pos = dotPosition(p)}
        {#if pos}
          <g>
            <circle
              cx={40 + (pos.x / 100) * 280}
              cy={220 - (pos.y / 100) * 200}
              r="5"
              fill={p.quadrant === 'healthy-adoption'
                ? '#15803d'
                : p.quadrant === 'aspirational-gap'
                  ? '#ca8a04'
                  : p.quadrant === 'cargo-cult'
                    ? '#ea580c'
                    : '#dc2626'}
              fill-opacity="0.85"
            />
            <text
              x={40 + (pos.x / 100) * 280 + 8}
              y={220 - (pos.y / 100) * 200 + 3}
              font-size="10"
              fill="#0f172a"
            >{p.team}</text>
          </g>
        {/if}
      {/each}
    </svg>
  </section>

  <section class="bg-white border border-slate-200 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">By team</h3>
    <table class="w-full text-sm">
      <thead class="bg-slate-100 text-left">
        <tr>
          <th class="p-2">Team</th>
          <th class="p-2">Organisation</th>
          <th class="p-2">Principles</th>
          <th class="p-2">Behaviour</th>
          <th class="p-2">Quadrant</th>
          <th class="p-2">Coaching focus</th>
        </tr>
      </thead>
      <tbody>
        {#each pairs as p (p.team + '\x00' + p.organisation)}
          <tr class="{rowClass(p.quadrant)} border-b border-slate-100">
            <td class="p-2 font-medium">{p.team}</td>
            <td class="p-2">{p.organisation}</td>
            <td class="p-2">
              {#if p.principles}
                {p.principles.scoreDisplay} · <span class="uppercase">{p.principles.maturity}</span>
              {:else}
                <span class="text-slate-500">— no row</span>
              {/if}
            </td>
            <td class="p-2">
              {#if p.behaviour}
                {p.behaviour.scoreDisplay} · <span class="uppercase">{p.behaviour.maturity}</span>
              {:else}
                <span class="text-slate-500">— no row</span>
              {/if}
            </td>
            <td class="p-2 font-medium uppercase">{quadrantLabel(p.quadrant)}</td>
            <td class="p-2 text-slate-700">{quadrantDescription(p.quadrant)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
{:else}
  <p class="text-sm text-slate-600">
    Upload both CSVs above to render the comparison.
  </p>
{/if}
