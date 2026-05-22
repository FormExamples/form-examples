<script lang="ts">
  import { STEPS } from '$lib/config/steps.js';
</script>

<section class="space-y-6">
  <p class="text-slate-700">
    Step through the 14-step wizard to draft an LP1H Lasting Power of Attorney for Health
    and Welfare. The validity engine checks every entry against the Mental Capacity Act
    2005 and the LPA Regulations 2007.
  </p>

  <ol class="grid gap-3 sm:grid-cols-2">
    {#each STEPS as step (step.number)}
      <li>
        <a
          href="/lpa/{step.number}"
          class="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-brand-500 hover:shadow"
        >
          <div class="flex items-baseline justify-between">
            <span class="text-sm font-medium text-brand-700">Step {step.number}</span>
            <span class="text-xs text-slate-500">{step.lp1hSection}</span>
          </div>
          <h2 class="mt-1 text-base font-semibold text-slate-900">{step.title}</h2>
          <p class="mt-1 text-sm text-slate-600">{step.description}</p>
        </a>
      </li>
    {/each}
  </ol>
</section>
