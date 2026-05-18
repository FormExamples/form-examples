<script lang="ts">
  import { goto } from '$app/navigation';
  import { store } from '$lib/stores/adr.svelte.js';
  import { parseMarkdown } from '$lib/report/parse-markdown.js';
  import Step01 from '$lib/components/steps/Step01Author.svelte';
  import Step02 from '$lib/components/steps/Step02Organization.svelte';
  import Step03 from '$lib/components/steps/Step03Issue.svelte';
  import Step04 from '$lib/components/steps/Step04Decision.svelte';
  import Step05 from '$lib/components/steps/Step05StatusGroup.svelte';
  import Step06 from '$lib/components/steps/Step06Assumptions.svelte';
  import Step07 from '$lib/components/steps/Step07Constraints.svelte';
  import Step08 from '$lib/components/steps/Step08Positions.svelte';
  import Step09 from '$lib/components/steps/Step09Argument.svelte';
  import Step10 from '$lib/components/steps/Step10Implications.svelte';
  import Step11 from '$lib/components/steps/Step11RelatedDecisions.svelte';
  import Step12 from '$lib/components/steps/Step12RelatedRequirements.svelte';
  import Step13 from '$lib/components/steps/Step13RelatedArtifacts.svelte';
  import Step14 from '$lib/components/steps/Step14RelatedPrinciples.svelte';
  import Step15 from '$lib/components/steps/Step15Notes.svelte';
  import Step16 from '$lib/components/steps/Step16Summary.svelte';

  const stepComponents = [
    Step01, Step02, Step03, Step04, Step05, Step06, Step07, Step08,
    Step09, Step10, Step11, Step12, Step13, Step14, Step15, Step16
  ];

  store.enableAutosave();

  function discardDraft() {
    if (confirm('Discard the current draft and start over?')) {
      store.reset();
    }
  }

  async function onImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseMarkdown(text);
    if (!parsed.adr.title.trim()) {
      alert('Could not parse Markdown — no "# title" heading found.');
      input.value = '';
      return;
    }
    if (!confirm(`Replace the current draft with the contents of ${file.name}?`)) {
      input.value = '';
      return;
    }
    store.replace(parsed);
    input.value = '';
  }
</script>

<section class="prose max-w-none">
  <p class="text-slate-700 my-4">
    Capture an architecture decision using the Tyree &amp; Akerman 14-section
    template. Complete all 16 steps; the report page renders a Markdown ADR
    ready to commit to <code>docs/adr/NNNN-slug.md</code>.
    Form state autosaves to your browser as you type.
  </p>
</section>

<div class="space-y-6">
  {#each stepComponents as StepComponent, i (i)}
    <div id="step-{i + 1}" class="bg-white p-6 rounded-lg shadow-sm scroll-mt-20">
      <StepComponent />
    </div>
  {/each}
</div>

<div class="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center gap-3">
  <button
    type="button"
    class="text-sm text-red-700 hover:underline"
    onclick={discardDraft}
  >
    Discard draft
  </button>

  <div class="flex gap-2 items-center">
    <label
      for="import-input"
      class="px-3 py-2 text-sm rounded border border-slate-300 bg-white hover:bg-slate-50 cursor-pointer"
    >
      Import .md
    </label>
    <input
      type="file"
      id="import-input"
      accept=".md,text/markdown,text/plain"
      class="hidden"
      onchange={onImport}
    />
    <button
      type="button"
      class="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700"
      onclick={() => goto('/report')}
    >
      Generate Markdown ADR
    </button>
  </div>
</div>
