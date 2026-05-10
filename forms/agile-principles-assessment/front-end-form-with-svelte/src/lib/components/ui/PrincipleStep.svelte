<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import { PRINCIPLES } from '$lib/config/principles.js';
  import LikertScale from './LikertScale.svelte';

  let { principleNumber }: { principleNumber: number } = $props();

  const principle = $derived(
    PRINCIPLES.find((p) => p.number === principleNumber) ?? PRINCIPLES[0],
  );
  const idx = $derived(principleNumber - 1);
  const stepIndex = $derived(principleNumber + 1); // step 2..13 covers principles 1..12
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">
    Step {stepIndex} — Principle {principleNumber}: {principle.shortTitle}
  </h2>
  <p class="text-slate-700 mb-3">
    <em>{principle.prompt}</em>
  </p>
  <p class="text-sm text-slate-600 mb-4">{principle.description}</p>

  <fieldset class="mb-4">
    <legend class="block text-sm font-medium text-slate-700 mb-2">
      How well does this describe your team / organisation today?
    </legend>
    <LikertScale
      name="principle-{principleNumber}"
      bind:value={store.data.responses[idx].score}
    />
  </fieldset>

  <label class="block">
    <span class="block text-sm font-medium text-slate-700 mb-1">Comment (optional)</span>
    <textarea
      rows="3"
      class="w-full border border-slate-300 rounded px-2 py-1 text-sm"
      placeholder="Concrete examples, blockers, or evidence — these populate the action plan."
      bind:value={store.data.responses[idx].comment}
    ></textarea>
  </label>
</section>
