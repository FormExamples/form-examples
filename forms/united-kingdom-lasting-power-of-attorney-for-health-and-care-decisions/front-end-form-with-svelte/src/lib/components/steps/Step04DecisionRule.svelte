<script lang="ts">
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import TextAreaField from '$lib/components/ui/TextAreaField.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';

  const app = $derived(lpaStore.application);
  function changed() {
    lpaStore.recompute();
  }
</script>

<div class="space-y-4">
  <SelectField
    label="How must the attorneys decide?"
    required
    bind:value={app.decisionRule}
    onchange={changed}
    options={[
      { value: 'jointly', label: 'Jointly (all must agree on every decision)' },
      { value: 'jointly-and-severally', label: 'Jointly and severally (any may decide alone)' },
      { value: 'mixed', label: 'Jointly for some decisions and severally for others' },
    ]}
    hint="LP1H s.3, MCA 2005 s.10(4)"
  />

  {#if app.decisionRule === 'mixed'}
    <TextAreaField
      label="Which decisions must be made jointly?"
      bind:value={app.jointDecisionSet}
      rows={4}
      onchange={changed}
      hint="List the decisions that require unanimous attorney agreement (R-MCA-JOINT-MIXED-SCOPE)."
    />
  {/if}

  {#if app.decisionRule === 'jointly' && app.replacementAttorneys.length > 0}
    <div class="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      Joint decision-making with replacement attorneys can cause the whole LPA to collapse if
      any one attorney drops out (R-MCA-JOINT-COLLAPSE).
    </div>
  {/if}
</div>
