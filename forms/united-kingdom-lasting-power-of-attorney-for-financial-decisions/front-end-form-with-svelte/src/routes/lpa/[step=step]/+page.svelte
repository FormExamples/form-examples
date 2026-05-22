<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import { STEPS, TOTAL_STEPS } from '$lib/config/steps.js';
  import ValidationSummary from '$lib/components/ui/ValidationSummary.svelte';
  import WizardNav from '$lib/components/ui/WizardNav.svelte';
  import Step1Donor from '$lib/components/steps/Step1Donor.svelte';
  import Step2Attorneys from '$lib/components/steps/Step2Attorneys.svelte';
  import Step3DecisionMode from '$lib/components/steps/Step3DecisionMode.svelte';
  import Step4ReplacementAttorneys from '$lib/components/steps/Step4ReplacementAttorneys.svelte';
  import Step5WhenAttorneysCanAct from '$lib/components/steps/Step5WhenAttorneysCanAct.svelte';
  import Step6PeopleToNotify from '$lib/components/steps/Step6PeopleToNotify.svelte';
  import Step7PreferencesAndInstructions from '$lib/components/steps/Step7PreferencesAndInstructions.svelte';
  import Step8LegalRights from '$lib/components/steps/Step8LegalRights.svelte';
  import Step9DonorSignature from '$lib/components/steps/Step9DonorSignature.svelte';
  import Step10CertificateProviderSignature from '$lib/components/steps/Step10CertificateProviderSignature.svelte';
  import Step11AttorneySignatures from '$lib/components/steps/Step11AttorneySignatures.svelte';
  import Step12Applicant from '$lib/components/steps/Step12Applicant.svelte';
  import Step13Recipient from '$lib/components/steps/Step13Recipient.svelte';
  import Step14ApplicationFee from '$lib/components/steps/Step14ApplicationFee.svelte';
  import Step15RegistrationSignature from '$lib/components/steps/Step15RegistrationSignature.svelte';

  let { data }: { data: { step: number } } = $props();
  const stepNumber = $derived(data.step);
  const stepDef = $derived(STEPS.find((s) => s.number === stepNumber));

  // Keep the store's currentStep in sync with the URL.
  $effect(() => {
    store.goto(stepNumber);
  });

  const prevHref = $derived(stepNumber > 1 ? `/lpa/${stepNumber - 1}` : null);
  const nextHref = $derived(stepNumber < TOTAL_STEPS ? `/lpa/${stepNumber + 1}` : null);
</script>

<div class="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] gap-6">
  <aside class="order-2 lg:order-1">
    <WizardNav />
  </aside>

  <article class="order-1 lg:order-2 bg-white border border-slate-200 rounded-lg p-6">
    {#if stepDef}
      <p class="text-xs uppercase tracking-wide text-slate-500 mb-2">
        Step {stepNumber} of {TOTAL_STEPS} &middot; LP1F section {stepDef.lp1fSection}
      </p>
    {/if}

    {#if stepNumber === 1}
      <Step1Donor />
    {:else if stepNumber === 2}
      <Step2Attorneys />
    {:else if stepNumber === 3}
      <Step3DecisionMode />
    {:else if stepNumber === 4}
      <Step4ReplacementAttorneys />
    {:else if stepNumber === 5}
      <Step5WhenAttorneysCanAct />
    {:else if stepNumber === 6}
      <Step6PeopleToNotify />
    {:else if stepNumber === 7}
      <Step7PreferencesAndInstructions />
    {:else if stepNumber === 8}
      <Step8LegalRights />
    {:else if stepNumber === 9}
      <Step9DonorSignature />
    {:else if stepNumber === 10}
      <Step10CertificateProviderSignature />
    {:else if stepNumber === 11}
      <Step11AttorneySignatures />
    {:else if stepNumber === 12}
      <Step12Applicant />
    {:else if stepNumber === 13}
      <Step13Recipient />
    {:else if stepNumber === 14}
      <Step14ApplicationFee />
    {:else if stepNumber === 15}
      <Step15RegistrationSignature />
    {/if}

    <div class="mt-6 flex justify-between border-t border-slate-200 pt-4">
      {#if prevHref}
        <a
          href={prevHref}
          class="px-3 py-2 rounded border border-slate-300 text-sm text-slate-700 hover:bg-slate-100"
        >
          &larr; Previous
        </a>
      {:else}
        <span></span>
      {/if}
      {#if nextHref}
        <a
          href={nextHref}
          class="px-3 py-2 rounded bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
        >
          Next &rarr;
        </a>
      {:else}
        <a
          href="/"
          class="px-3 py-2 rounded bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
        >
          Finish
        </a>
      {/if}
    </div>
  </article>

  <aside class="order-3">
    <ValidationSummary />
  </aside>
</div>
