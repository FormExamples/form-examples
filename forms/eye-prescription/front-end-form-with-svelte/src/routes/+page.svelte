<script lang="ts">
  import { store } from '$lib/stores/prescription.svelte.js';
  import Step01 from '$lib/components/steps/Step01Prescriber.svelte';
  import Step02 from '$lib/components/steps/Step02Patient.svelte';
  import Step03 from '$lib/components/steps/Step03Examination.svelte';
  import Step04 from '$lib/components/steps/Step04VisualAcuity.svelte';
  import Step05 from '$lib/components/steps/Step05RightEye.svelte';
  import Step06 from '$lib/components/steps/Step06LeftEye.svelte';
  import Step07 from '$lib/components/steps/Step07Addition.svelte';
  import Step08 from '$lib/components/steps/Step08PupillaryDistance.svelte';
  import Step09 from '$lib/components/steps/Step09LensRecommendation.svelte';
  import Step10 from '$lib/components/steps/Step10OcularHealth.svelte';
  import Step11 from '$lib/components/steps/Step11Summary.svelte';

  let showReport = $state(false);

  function reset(): void {
    if (!confirm('Discard all entered data and start over?')) return;
    store.reset();
    showReport = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<section class="prose max-w-none mb-6">
  <p class="text-slate-700">
    Complete all 11 sections below — each one is a fieldset on this same
    continuous page. The engine computes a per-eye refractive class,
    composite complexity, and safety flags in real time, visible in the
    summary at step 11.
  </p>
  <p class="text-xs text-slate-500 mt-1">
    Storage convention: <strong>minus-cylinder</strong>. The signing
    prescriber is responsible for the final prescription.
  </p>
</section>

<div class="space-y-6">
  <Step01 />
  <Step02 />
  <Step03 />
  <Step04 />
  <Step05 />
  <Step06 />
  <Step07 />
  <Step08 />
  <Step09 />
  <Step10 />
  <Step11 />
</div>

<div class="mt-8 pt-4 border-t border-slate-200 flex gap-3 justify-end">
  <button
    type="button"
    class="px-4 py-2 rounded border border-slate-300 bg-white hover:bg-slate-50"
    onclick={reset}
  >
    Start over
  </button>
  <button
    type="button"
    class="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700"
    onclick={() => { showReport = true; setTimeout(() => document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
  >
    Generate prescription
  </button>
</div>

{#if showReport}
  <article id="report" class="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
    <h2 class="text-lg font-semibold mb-2">Spectacle prescription</h2>
    <p class="text-sm">
      <strong>Patient:</strong> {store.data.patient.name || '—'}
      (DOB {store.data.patient.birthDate || '—'})<br>
      <strong>Prescriber:</strong> {store.data.prescriber.name || '—'}
      (GOC {store.data.prescriber.gocRegistrationNumber || '—'})<br>
      <strong>Issue:</strong> {store.data.examination.issueDate || '—'}
      &middot; <strong>Expiry:</strong> {store.data.examination.expiryDate || '—'}
    </p>
    <p class="mt-3 text-sm">
      <strong>Complexity:</strong> {store.data.grade.overrideComplexity || store.result.complexity}
      &middot; <strong>Flags:</strong> {store.result.additionalFlags.length}
    </p>
    <pre class="mt-4 p-3 bg-slate-50 rounded text-xs overflow-x-auto">{JSON.stringify({ prescription: store.data, classification: store.result }, null, 2)}</pre>
  </article>
{/if}
