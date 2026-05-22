<script lang="ts">
  import { STEPS } from '$lib/config/steps.js';
</script>

<nav class="bg-white border border-slate-200 rounded-lg p-3 sticky top-4">
  <h3 class="text-sm font-bold uppercase tracking-wide text-slate-700 mb-2">Steps</h3>
  <ol class="space-y-1">
    {#each STEPS as s (s.number)}
      <li>
        <a
          href="#step-{s.number}"
          class="block text-sm text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded px-2 py-1"
        >
          <span class="font-mono text-xs text-slate-500">{s.number}.</span>
          {s.short}
        </a>
      </li>
    {/each}
  </ol>
</nav>
