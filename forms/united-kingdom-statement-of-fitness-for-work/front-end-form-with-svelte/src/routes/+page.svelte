<script lang="ts">
  import { goto } from '$app/navigation';
  import { SAMPLE_FIT_NOTES } from '$lib/sample-data.js';
  import { store } from '$lib/store.svelte.js';

  function start() {
    store.reset();
    goto('/fit-note/1');
  }

  function loadSample(id: string) {
    const sample = SAMPLE_FIT_NOTES.find((s) => s.id === id);
    if (!sample) return;
    store.load(sample.build());
    goto('/fit-note/10');
  }
</script>

<section class="prose max-w-none">
  <h2 class="text-2xl font-semibold text-brand-700">UK Statement of Fitness for Work</h2>
  <p class="text-slate-700 my-4">
    This wizard captures a Med 3 / fit note via a ten-step single-page flow.
    The form supports any 2022-authorised issuer (doctor, nurse, occupational
    therapist, pharmacist, physiotherapist), records the diagnosis and the
    fitness category, optionally captures up to four workplace adaptations,
    and computes a policy-compliance grade with safety flags drawn directly
    from DWP guidance.
  </p>
  <p class="text-slate-700 my-4">
    The grading engine mirrors the canonical
    <code>front-end-form-with-html/js/grader.js</code> implementation 1:1,
    so dashboards and back-ends can group rows by rule and flag identifier
    across every stack.
  </p>
</section>

<div class="mt-6 flex flex-wrap gap-3 items-center">
  <button
    type="button"
    class="px-5 py-2 rounded bg-brand-600 text-white font-medium hover:bg-brand-700"
    onclick={start}
  >
    Start a new fit note
  </button>
  <span class="text-sm text-slate-500">or load a sample:</span>
  {#each SAMPLE_FIT_NOTES as s (s.id)}
    <button
      type="button"
      class="px-3 py-2 rounded border border-brand-600 text-brand-700 text-sm hover:bg-brand-50"
      onclick={() => loadSample(s.id)}
    >
      {s.label}
    </button>
  {/each}
</div>

<section class="mt-10 prose max-w-none">
  <h3 class="text-lg font-semibold">Wizard steps</h3>
  <ol class="list-decimal list-inside text-sm text-slate-700 space-y-1 mt-2">
    <li>Issuer identification</li>
    <li>Patient identification</li>
    <li>Assessment</li>
    <li>Diagnosis</li>
    <li>Fitness for work (not fit / may be fit)</li>
    <li>Adaptations (only if "may be fit")</li>
    <li>Comments</li>
    <li>Period (duration or from / to)</li>
    <li>Follow-up</li>
    <li>Sign-off with computed grade and safety flags</li>
  </ol>
</section>
