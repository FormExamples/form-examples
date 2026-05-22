<script lang="ts">
  import { STEPS } from '$lib/config/steps.js';
</script>

<section class="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
  <h1 class="text-2xl font-bold text-slate-900">Make a Lasting Power of Attorney (LP1F)</h1>
  <p class="text-sm text-slate-700">
    The LP1F is the official UK form for appointing one or more attorneys to make decisions
    about your property and financial affairs. The form has 15 sections. This wizard walks
    you through each one, validates as you go, and surfaces any statutory blockers.
  </p>
  <p class="text-sm text-slate-700">
    The donor (the person making the LPA) must be 18 or older and have mental capacity at
    the time of signing. Attorneys must also be 18 or older and not currently bankrupt or
    subject to a debt relief order.
  </p>

  <div class="flex flex-wrap gap-2">
    <a
      href="/lpa/1"
      class="inline-block px-4 py-2 rounded bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
    >
      Start the form
    </a>
    <a
      href="/lpa/9"
      class="inline-block px-4 py-2 rounded bg-white border border-slate-300 text-slate-700 text-sm hover:bg-slate-100"
    >
      Jump to signing (step 9)
    </a>
  </div>

  <details class="mt-6">
    <summary class="cursor-pointer text-sm font-semibold text-slate-700">All 15 steps</summary>
    <ol class="mt-2 list-decimal list-inside text-sm text-slate-700 space-y-1">
      {#each STEPS as s (s.number)}
        <li>
          <a class="hover:underline" href={`/lpa/${s.number}`}>{s.title}</a>
          <span class="text-xs text-slate-500">(LP1F section {s.lp1fSection})</span>
        </li>
      {/each}
    </ol>
  </details>
</section>
