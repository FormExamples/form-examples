<script lang="ts">
  import { page } from '$app/stores';
  import { aggregateByTeam } from '$lib/aggregate.js';
  import Sparkline from '$lib/components/Sparkline.svelte';
  import { rowsStore } from '$lib/stores/rows.svelte.js';

  const id = $derived($page.params.id ?? '');
  const row = $derived(id ? rowsStore.byId(id) : undefined);
  const teamAgg = $derived.by(() => {
    if (!row) return null;
    const same = rowsStore.rows.filter(
      (r) => r.team === row.team && r.organisation === row.organisation,
    );
    return aggregateByTeam(same)[0] ?? null;
  });

  function pct(p: number | null): string {
    return p === null ? '—' : `${p.toFixed(0)}%`;
  }

  function maturityClass(m: string): string {
    switch (m) {
      case 'optimising':
        return 'border-emerald-600 bg-emerald-50 text-emerald-900';
      case 'mature':
        return 'border-green-600 bg-green-50 text-green-900';
      case 'developing':
        return 'border-yellow-600 bg-yellow-50 text-yellow-900';
      case 'initial':
        return 'border-orange-600 bg-orange-50 text-orange-900';
      case 'ad-hoc':
        return 'border-red-600 bg-red-50 text-red-900';
      default:
        return 'border-slate-500 bg-slate-50 text-slate-800';
    }
  }

  const teammates = $derived(
    row
      ? rowsStore.rows
          .filter(
            (r) =>
              r.team === row.team && r.organisation === row.organisation && r.id !== row.id,
          )
          .sort((a, b) => a.date.localeCompare(b.date))
      : [],
  );
</script>

<nav class="text-sm mb-4">
  <a href="/" class="text-brand-700 hover:underline">← Back to dashboard</a>
</nav>

{#if !row}
  <p class="text-sm text-red-700">
    No submission found with id <code class="font-mono">{id}</code>. It may have been
    filtered out by an import or the link is stale.
  </p>
{:else}
  <header class="mb-4">
    <h2 class="text-xl font-semibold">
      {row.team} <span class="text-slate-500">/</span> {row.organisation}
    </h2>
    <p class="text-sm text-slate-600">
      Submission <code class="font-mono">{row.id}</code> · {row.date}
    </p>
  </header>

  <div
    class="border-l-4 p-4 rounded mb-4 {maturityClass(row.maturity)}"
    role="status"
  >
    <p class="font-semibold mb-1">Composite maturity: {row.maturity.toUpperCase()}</p>
    <p class="text-sm">
      <strong>Overall:</strong> {pct(row.overallPercent)} ·
      <strong>Items answered:</strong> {row.answered} / 57
    </p>
  </div>

  <section class="bg-white border border-slate-200 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">Per-section breakdown</h3>
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-slate-100 text-left">
          <th class="p-2">Section</th>
          <th class="p-2">Percent yes</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-slate-100">
          <td class="p-2">Teams (25 items)</td>
          <td class="p-2 font-medium">{pct(row.teamsPercent)}</td>
        </tr>
        <tr class="border-b border-slate-100">
          <td class="p-2">Stakeholders (14 items)</td>
          <td class="p-2 font-medium">{pct(row.stakeholdersPercent)}</td>
        </tr>
        <tr>
          <td class="p-2">Practices (18 items)</td>
          <td class="p-2 font-medium">{pct(row.practicesPercent)}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="bg-white border border-slate-200 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">Respondent</h3>
    <dl class="grid grid-cols-1 md:grid-cols-2 gap-y-1 text-sm">
      <dt class="text-slate-600">Name</dt>
      <dd>{row.isAnonymous ? 'Anonymous 🔒' : row.respondent || '—'}</dd>
      <dt class="text-slate-600">Role</dt>
      <dd>{row.isAnonymous ? '—' : row.role || '—'}</dd>
      <dt class="text-slate-600">Team</dt>
      <dd>{row.team}</dd>
      <dt class="text-slate-600">Organisation</dt>
      <dd>{row.organisation}</dd>
    </dl>
  </section>

  <section class="bg-white border border-slate-200 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">
      Weak sections
      <span class="text-xs text-slate-500 font-normal">— sections below 50% yes</span>
    </h3>
    {#if row.weakSections.length === 0}
      <p class="text-sm text-slate-600">No section flagged as weak for this submission.</p>
    {:else}
      <ul class="list-disc list-inside text-sm space-y-1">
        {#each row.weakSections as s (s)}
          <li>{s}</li>
        {/each}
      </ul>
    {/if}
  </section>

  <section class="bg-white border border-slate-200 rounded p-4 mb-4">
    <h3 class="font-semibold mb-2">Operational flags</h3>
    {#if row.flags.length === 0}
      <p class="text-sm text-slate-600">No operational flags raised.</p>
    {:else}
      <ul class="list-disc list-inside text-sm space-y-1">
        {#each row.flags as f (f)}
          <li><code class="text-xs">{f}</code></li>
        {/each}
      </ul>
    {/if}
  </section>

  {#if teamAgg && teamAgg.trend.length > 1}
    <section class="bg-white border border-slate-200 rounded p-4 mb-4">
      <h3 class="font-semibold mb-2">Team trend</h3>
      <p class="text-sm text-slate-600 mb-2">
        Mean of overall % across {teamAgg.count} submissions for this team:
        <strong>{teamAgg.meanOfMeans !== null ? `${teamAgg.meanOfMeans.toFixed(0)}%` : '—'}</strong>
      </p>
      <Sparkline trend={teamAgg.trend} maturity={teamAgg.maturity} width={240} height={60} />
    </section>
  {/if}

  {#if teammates.length > 0}
    <section class="bg-white border border-slate-200 rounded p-4 mb-4">
      <h3 class="font-semibold mb-2">Other submissions in this team</h3>
      <ul class="text-sm space-y-1">
        {#each teammates as r (r.id)}
          <li>
            <a href="/submission/{r.id}" class="text-brand-700 hover:underline">
              {r.date} · {pct(r.overallPercent)} · {r.maturity.toUpperCase()}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
{/if}
