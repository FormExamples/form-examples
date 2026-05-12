<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import { calculateMaturity } from '$lib/grading/maturity-grader.js';

  const d = $derived(store.data);
  const result = $derived(calculateMaturity(store.data));

  const SECTIONS: [number, string][] = [
    [1, 'Introduction & Goals'],
    [2, 'Constraints'],
    [3, 'Context & Scope'],
    [4, 'Solution Strategy'],
    [5, 'Building Block View'],
    [6, 'Runtime View'],
    [7, 'Deployment View'],
    [8, 'Crosscutting Concepts'],
    [9, 'Architectural Decisions'],
    [10, 'Quality Requirements'],
    [11, 'Risks & Technical Debt'],
    [12, 'Glossary'],
  ];

  function completenessClass(c: string) {
    if (c === 'complete') return 'text-green-700 font-semibold';
    if (c === 'partial') return 'text-yellow-700 font-semibold';
    return 'text-red-700 font-semibold';
  }
</script>

<div class="max-w-4xl mx-auto px-4 py-8 space-y-10">
  <!-- Header / title block -->
  <section>
    <h1 class="text-3xl font-bold text-slate-800 mb-2">
      {d.architecture.name || 'Untitled Architecture'}
    </h1>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-600 mb-4">
      <div><span class="font-semibold">Version:</span> {d.architecture.version || '—'}</div>
      <div><span class="font-semibold">Owner:</span> {d.architecture.owner || '—'}</div>
      <div><span class="font-semibold">Status:</span> {d.architecture.status || '—'}</div>
      <div><span class="font-semibold">Author:</span> {d.authorName || '—'}</div>
      <div><span class="font-semibold">Role:</span> {d.authorRole || '—'}</div>
      <div><span class="font-semibold">Date:</span> {d.documentDate || '—'}</div>
    </div>
    {#if d.architecture.description}
      <p class="text-slate-700">{d.architecture.description}</p>
    {/if}
    <!-- Download links -->
    <div class="flex gap-4 mt-4">
      <a
        href="/report/pdf"
        class="inline-block px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        download="arc42.pdf"
      >
        Download PDF
      </a>
      <a
        href="/report/asciidoc"
        class="inline-block px-4 py-2 rounded bg-slate-600 text-white text-sm font-semibold hover:bg-slate-700"
        download="arc42.adoc"
      >
        Download AsciiDoc bundle
      </a>
    </div>
  </section>

  <!-- §1 Introduction & Goals -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§1 Introduction & Goals</h2>
    <p class="text-slate-700 mb-4">{d.introduction || '—'}</p>

    <h3 class="text-base font-semibold text-slate-700 mb-2">Business Goals</h3>
    {#if d.businessGoals.length === 0}
      <p class="text-slate-500 italic">No business goals recorded.</p>
    {:else}
      <ul class="list-disc pl-5 space-y-1 text-sm text-slate-700 mb-4">
        {#each d.businessGoals as g}
          <li><strong>{g.name}</strong> — {g.description}</li>
        {/each}
      </ul>
    {/if}

    <h3 class="text-base font-semibold text-slate-700 mb-2">Quality Goals</h3>
    {#if d.qualityGoals.length === 0}
      <p class="text-slate-500 italic">No quality goals recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Priority</th><th class="text-left p-2 border">Scenario</th></tr></thead>
        <tbody>
          {#each d.qualityGoals as g}
            <tr><td class="p-2 border">{g.name}</td><td class="p-2 border capitalize">{g.priority || '—'}</td><td class="p-2 border">{g.scenario || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}

    <h3 class="text-base font-semibold text-slate-700 mb-2">Stakeholders</h3>
    {#if d.stakeholders.length === 0}
      <p class="text-slate-500 italic">No stakeholders recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Role</th><th class="text-left p-2 border">Concerns</th></tr></thead>
        <tbody>
          {#each d.stakeholders as s}
            <tr><td class="p-2 border">{s.name}</td><td class="p-2 border">{s.role || '—'}</td><td class="p-2 border">{s.concerns || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §2 Constraints -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§2 Constraints</h2>
    {#if d.constraintItems.length === 0}
      <p class="text-slate-500 italic">No constraints recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Kind</th><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Description</th></tr></thead>
        <tbody>
          {#each d.constraintItems as c}
            <tr><td class="p-2 border capitalize">{c.kind || '—'}</td><td class="p-2 border">{c.name}</td><td class="p-2 border">{c.description || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §3 Context & Scope -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§3 Context & Scope</h2>
    <h3 class="text-base font-semibold text-slate-700 mb-1">Business Context</h3>
    <p class="text-slate-700 mb-4">{d.businessContextDescription || '—'}</p>
    <h3 class="text-base font-semibold text-slate-700 mb-1">Technical Context</h3>
    <p class="text-slate-700 mb-4">{d.technicalContextDescription || '—'}</p>
    <h3 class="text-base font-semibold text-slate-700 mb-2">Context Partners</h3>
    {#if d.contextPartners.length === 0}
      <p class="text-slate-500 italic">No context partners recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Kind</th><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Interface</th><th class="text-left p-2 border">Protocol</th><th class="text-left p-2 border">Direction</th></tr></thead>
        <tbody>
          {#each d.contextPartners as p}
            <tr><td class="p-2 border capitalize">{p.kind || '—'}</td><td class="p-2 border">{p.name}</td><td class="p-2 border">{p.interfaceDescription || '—'}</td><td class="p-2 border">{p.protocol || '—'}</td><td class="p-2 border">{p.direction || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §4 Solution Strategy -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§4 Solution Strategy</h2>
    <p class="text-slate-700 mb-4">{d.solutionStrategySummary || '—'}</p>
    <h3 class="text-base font-semibold text-slate-700 mb-2">Technology Decisions</h3>
    {#if d.technologyDecisions.length === 0}
      <p class="text-slate-500 italic">No technology decisions recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Category</th><th class="text-left p-2 border">Choice</th><th class="text-left p-2 border">Rationale</th></tr></thead>
        <tbody>
          {#each d.technologyDecisions as t}
            <tr><td class="p-2 border">{t.category || '—'}</td><td class="p-2 border">{t.choice}</td><td class="p-2 border">{t.rationale || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
    <h3 class="text-base font-semibold text-slate-700 mb-1">Top-Level Decomposition</h3>
    <p class="text-slate-700 mb-4">{d.topLevelDecompositionSummary || '—'}</p>
    {#if d.qualityStrategies.length > 0}
      <h3 class="text-base font-semibold text-slate-700 mb-2">Quality Strategies</h3>
      <ul class="list-disc pl-5 space-y-1 text-sm text-slate-700 mb-4">
        {#each d.qualityStrategies as s}
          <li>{s}</li>
        {/each}
      </ul>
    {/if}
  </section>

  <!-- §5 Building Block View -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§5 Building Block View</h2>
    <p class="text-slate-700 mb-4">{d.buildingBlockOverview || '—'}</p>
    {#if d.buildingBlocks.length === 0}
      <p class="text-slate-500 italic">No building blocks recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">#</th><th class="text-left p-2 border">Parent</th><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Responsibility</th></tr></thead>
        <tbody>
          {#each d.buildingBlocks as b}
            <tr><td class="p-2 border">{b.ordinal}</td><td class="p-2 border">{b.parentOrdinal ?? '—'}</td><td class="p-2 border">{b.name}</td><td class="p-2 border">{b.responsibility || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §6 Runtime View -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§6 Runtime View</h2>
    <p class="text-slate-700 mb-4">{d.runtimeOverview || '—'}</p>
    {#if d.runtimeScenarios.length === 0}
      <p class="text-slate-500 italic">No runtime scenarios recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Trigger</th><th class="text-left p-2 border">Steps Summary</th></tr></thead>
        <tbody>
          {#each d.runtimeScenarios as r}
            <tr><td class="p-2 border">{r.name}</td><td class="p-2 border">{r.triggerDescription || '—'}</td><td class="p-2 border">{r.stepsSummary || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §7 Deployment View -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§7 Deployment View</h2>
    <p class="text-slate-700 mb-4">{d.deploymentOverview || '—'}</p>
    {#if d.deploymentNodes.length === 0}
      <p class="text-slate-500 italic">No deployment nodes recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Environment</th><th class="text-left p-2 border">Node</th><th class="text-left p-2 border">Responsibility</th></tr></thead>
        <tbody>
          {#each d.deploymentNodes as n}
            <tr><td class="p-2 border capitalize">{n.environment || '—'}</td><td class="p-2 border">{n.nodeName}</td><td class="p-2 border">{n.responsibility || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §8 Crosscutting Concepts -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§8 Crosscutting Concepts</h2>
    <p class="text-slate-700 mb-4">{d.crosscuttingOverview || '—'}</p>
    {#if d.crosscuttingConcepts.length === 0}
      <p class="text-slate-500 italic">No crosscutting concepts recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Description</th></tr></thead>
        <tbody>
          {#each d.crosscuttingConcepts as c}
            <tr><td class="p-2 border">{c.name}</td><td class="p-2 border">{c.description || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §9 Architectural Decisions -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§9 Architectural Decisions</h2>
    {#if d.architecturalDecisions.length === 0}
      <p class="text-slate-500 italic">No ADRs recorded.</p>
    {:else}
      {#each d.architecturalDecisions as adr}
        <div class="mb-6 border rounded p-4 bg-slate-50">
          <h3 class="text-base font-semibold text-slate-800 mb-1">
            {adr.ordinal}. {adr.title}
            <span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">{adr.status || 'draft'}</span>
          </h3>
          <div class="text-sm space-y-2">
            <div><span class="font-semibold">Context:</span> {adr.context || '—'}</div>
            <div><span class="font-semibold">Decision:</span> {adr.decision || '—'}</div>
            <div><span class="font-semibold">Consequences:</span> {adr.consequences || '—'}</div>
          </div>
        </div>
      {/each}
    {/if}
  </section>

  <!-- §10 Quality Requirements -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§10 Quality Requirements</h2>
    <p class="text-slate-700 mb-4">{d.qualityTreeSummary || '—'}</p>
    {#if d.qualityScenarios.length === 0}
      <p class="text-slate-500 italic">No quality scenarios recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Source</th><th class="text-left p-2 border">Stimulus</th><th class="text-left p-2 border">Artifact</th><th class="text-left p-2 border">Response</th><th class="text-left p-2 border">Measure</th></tr></thead>
        <tbody>
          {#each d.qualityScenarios as q}
            <tr><td class="p-2 border">{q.source || '—'}</td><td class="p-2 border">{q.stimulus || '—'}</td><td class="p-2 border">{q.artifact || '—'}</td><td class="p-2 border">{q.response || '—'}</td><td class="p-2 border">{q.measure || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §11 Risks & Technical Debt -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§11 Risks & Technical Debt</h2>
    {#if d.riskItems.length === 0}
      <p class="text-slate-500 italic">No risks or technical debt recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Kind</th><th class="text-left p-2 border">Name</th><th class="text-left p-2 border">Probability</th><th class="text-left p-2 border">Impact</th><th class="text-left p-2 border">Mitigation</th></tr></thead>
        <tbody>
          {#each d.riskItems as r}
            <tr><td class="p-2 border capitalize">{r.kind || '—'}</td><td class="p-2 border">{r.name}</td><td class="p-2 border capitalize">{r.probability || '—'}</td><td class="p-2 border capitalize">{r.impact || '—'}</td><td class="p-2 border">{r.mitigation || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- §12 Glossary -->
  <section>
    <h2 class="text-xl font-bold text-blue-800 border-b pb-1 mb-3">§12 Glossary</h2>
    {#if d.glossaryTerms.length === 0}
      <p class="text-slate-500 italic">No glossary terms recorded.</p>
    {:else}
      <table class="w-full text-sm border-collapse mb-4">
        <thead><tr class="bg-slate-100"><th class="text-left p-2 border">Term</th><th class="text-left p-2 border">Definition</th></tr></thead>
        <tbody>
          {#each d.glossaryTerms as g}
            <tr><td class="p-2 border font-semibold">{g.term}</td><td class="p-2 border">{g.definition || '—'}</td></tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>

  <!-- Maturity Report -->
  <section class="bg-slate-50 border border-slate-200 rounded p-6">
    <h2 class="text-xl font-bold text-slate-800 mb-4">Maturity Report</h2>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <span class="text-xs text-slate-500 uppercase tracking-wide">Computed Maturity</span>
        <p class="text-lg font-bold capitalize {result.computedMaturity === 'mature' ? 'text-green-700' : result.computedMaturity === 'ready' ? 'text-blue-700' : result.computedMaturity === 'reviewable' ? 'text-yellow-700' : 'text-red-700'}">{result.computedMaturity || '—'}</p>
      </div>
      <div>
        <span class="text-xs text-slate-500 uppercase tracking-wide">Final Maturity</span>
        <p class="text-lg font-bold capitalize {result.finalMaturity === 'mature' ? 'text-green-700' : result.finalMaturity === 'ready' ? 'text-blue-700' : result.finalMaturity === 'reviewable' ? 'text-yellow-700' : 'text-red-700'}">{result.finalMaturity || '—'}</p>
      </div>
    </div>

    {#if d.finalMaturityOverride}
      <p class="text-sm text-slate-600 mb-4">Override reason: {d.finalMaturityOverrideReason || '—'}</p>
    {/if}

    <h3 class="text-sm font-semibold text-slate-700 mb-2">Completeness by Section</h3>
    <ul class="grid grid-cols-2 md:grid-cols-3 gap-1 mb-4 text-sm">
      {#each SECTIONS as [n, name]}
        <li class="flex gap-2">
          <span class="text-slate-500">§{n}</span>
          <span class="{completenessClass(result.completenessBySection[n] ?? 'empty')} capitalize">{result.completenessBySection[n] ?? 'empty'}</span>
        </li>
      {/each}
    </ul>

    {#if result.firedRules.length > 0}
      <h3 class="text-sm font-semibold text-slate-700 mb-2">Fired Rules</h3>
      <ul class="text-sm space-y-1 mb-4">
        {#each result.firedRules as rule}
          <li><span class="font-mono text-xs text-slate-500">{rule.ruleId}</span> — {rule.description}</li>
        {/each}
      </ul>
    {/if}

    {#if result.additionalFlags.length > 0}
      <h3 class="text-sm font-semibold text-slate-700 mb-2">Additional Flags</h3>
      <ul class="text-sm space-y-1 mb-4">
        {#each result.additionalFlags as flag}
          <li class="{flag.priority === 'high' ? 'text-red-700' : flag.priority === 'medium' ? 'text-yellow-700' : 'text-slate-600'}">
            [{flag.priority.toUpperCase()}] {flag.category}: {flag.description}
          </li>
        {/each}
      </ul>
    {/if}

    {#if d.recommendation}
      <p class="text-sm font-semibold text-slate-700 mb-1">Recommendation: <span class="capitalize font-normal">{d.recommendation}</span></p>
    {/if}
    {#if d.additionalNotes}
      <p class="text-sm text-slate-700 mb-4">{d.additionalNotes}</p>
    {/if}
    {#if d.signedBy}
      <p class="text-sm text-slate-700">Signed: {d.signedBy} &nbsp;&nbsp; Date: {d.signedAt || '—'}</p>
    {:else}
      <p class="text-sm text-slate-500 mt-6">Signed: ____________________________   Date: _______________</p>
    {/if}
  </section>
</div>
