<script lang="ts">
  import { page } from '$app/state';
  import Progress from '$lib/components/ui/Progress.svelte';
  import Step01Donor from '$lib/components/steps/Step01Donor.svelte';
  import Step02Scope from '$lib/components/steps/Step02Scope.svelte';
  import Step03Attorneys from '$lib/components/steps/Step03Attorneys.svelte';
  import Step04DecisionRule from '$lib/components/steps/Step04DecisionRule.svelte';
  import Step05ReplacementAttorneys from '$lib/components/steps/Step05ReplacementAttorneys.svelte';
  import Step06LifeSustainingTreatment from '$lib/components/steps/Step06LifeSustainingTreatment.svelte';
  import Step07Preferences from '$lib/components/steps/Step07Preferences.svelte';
  import Step08Instructions from '$lib/components/steps/Step08Instructions.svelte';
  import Step09PeopleToNotify from '$lib/components/steps/Step09PeopleToNotify.svelte';
  import Step10CertificateProvider from '$lib/components/steps/Step10CertificateProvider.svelte';
  import Step11DonorSignature from '$lib/components/steps/Step11DonorSignature.svelte';
  import Step12AttorneySignatures from '$lib/components/steps/Step12AttorneySignatures.svelte';
  import Step13Registration from '$lib/components/steps/Step13Registration.svelte';
  import Step14Summary from '$lib/components/steps/Step14Summary.svelte';
  import { stepByNumber, STEP_COUNT } from '$lib/config/steps.js';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';

  const stepNumber = $derived(Number(page.params.step));
  const step = $derived(stepByNumber(stepNumber));
  const prevHref = $derived(stepNumber > 1 ? `/lpa/${stepNumber - 1}` : '/');
  const nextHref = $derived(stepNumber < STEP_COUNT ? `/lpa/${stepNumber + 1}` : `/lpa/${STEP_COUNT}`);

  $effect(() => {
    lpaStore.goToStep(stepNumber);
  });
</script>

<div class="mb-6">
  <Progress current={stepNumber} total={STEP_COUNT} />
</div>

<nav class="mb-6 flex items-center justify-between text-sm">
  <a class="text-brand-600 hover:text-brand-700" href={prevHref}>← Previous</a>
  <span class="text-slate-500">Step {stepNumber} of {STEP_COUNT}</span>
  <a class="text-brand-600 hover:text-brand-700" href={nextHref}>Next →</a>
</nav>

{#if step}
  <article class="rounded-lg bg-white p-6 shadow-sm">
    <header class="mb-4">
      <p class="text-xs uppercase tracking-wide text-slate-500">LP1H {step.lp1hSection}</p>
      <h2 class="text-2xl font-semibold text-slate-900">{step.title}</h2>
      <p class="mt-1 text-slate-700">{step.description}</p>
    </header>

    {#if stepNumber === 1}<Step01Donor />
    {:else if stepNumber === 2}<Step02Scope />
    {:else if stepNumber === 3}<Step03Attorneys />
    {:else if stepNumber === 4}<Step04DecisionRule />
    {:else if stepNumber === 5}<Step05ReplacementAttorneys />
    {:else if stepNumber === 6}<Step06LifeSustainingTreatment />
    {:else if stepNumber === 7}<Step07Preferences />
    {:else if stepNumber === 8}<Step08Instructions />
    {:else if stepNumber === 9}<Step09PeopleToNotify />
    {:else if stepNumber === 10}<Step10CertificateProvider />
    {:else if stepNumber === 11}<Step11DonorSignature />
    {:else if stepNumber === 12}<Step12AttorneySignatures />
    {:else if stepNumber === 13}<Step13Registration />
    {:else if stepNumber === 14}<Step14Summary />
    {/if}
  </article>

  {#if stepNumber < STEP_COUNT}
    <aside class="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm">
      <div class="flex items-center gap-2">
        <span class="font-medium text-slate-700">Validity:</span>
        <span
          class="rounded px-2 py-0.5 text-xs font-medium {lpaStore.validity.validityStatus === 'ready-to-register'
            ? 'bg-green-100 text-green-800'
            : lpaStore.validity.validityStatus === 'needs-correction'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'}"
        >
          {lpaStore.validity.validityStatus || 'unknown'}
        </span>
        <span class="ml-auto text-slate-500">
          {lpaStore.validity.completenessScore}% complete
        </span>
      </div>
      {#if lpaStore.validity.firedRules.length > 0}
        <ul class="mt-3 space-y-1 text-xs text-slate-700">
          {#each lpaStore.validity.firedRules.slice(0, 5) as rule (rule.ruleId)}
            <li>
              <span class="font-mono text-slate-500">{rule.ruleId}</span>
              — {rule.description}
            </li>
          {/each}
        </ul>
      {/if}
    </aside>
  {/if}
{/if}
