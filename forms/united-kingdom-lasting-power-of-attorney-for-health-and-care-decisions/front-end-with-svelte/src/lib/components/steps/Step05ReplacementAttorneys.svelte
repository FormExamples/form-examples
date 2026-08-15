<script lang="ts">
  import FormField from '#lib/components/ui/FormField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import YesNoField from '#lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '#lib/stores/lpa.svelte.js';
  import { emptyReplacementAttorney } from '#lib/engine/factory.js';

  const reps = $derived(lpaStore.application.replacementAttorneys);
  function changed() {
    lpaStore.recompute();
  }
  function addRep() {
    if (reps.length < 4) {
      reps.push(emptyReplacementAttorney());
      changed();
    }
  }
  function removeRep(i: number) {
    reps.splice(i, 1);
    changed();
  }

  const RELATIONSHIPS = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'civil-partner', label: 'Civil partner' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'professional', label: 'Professional' },
    { value: 'other', label: 'Other' },
  ];
</script>

<div class="space-y-6">
  <p class="text-sm text-base-content/70">
    0 to 4 replacement attorneys. They step in if a primary attorney is unable or unwilling
    to act.
  </p>

  {#each reps as r, i (i)}
    <section class="rounded-lg border border-base-300 bg-base-200 p-4">
      <header class="mb-3 flex items-center justify-between">
        <h3 class="font-medium text-base-content">Replacement attorney #{i + 1}</h3>
        <button
          type="button"
          onclick={() => removeRep(i)}
          class="text-sm text-error hover:underline"
        >
          Remove
        </button>
      </header>
      <div class="grid gap-3 sm:grid-cols-2">
        <FormField label="Given names" required bind:value={r.givenNames} onchange={changed} />
        <FormField label="Family name" required bind:value={r.familyName} onchange={changed} />
        <FormField label="Date of birth" type="date" bind:value={r.birthDate} onchange={changed} />
        <SelectField
          label="Relationship to donor"
          bind:value={r.relationshipToDonor}
          options={RELATIONSHIPS}
          onchange={changed}
        />
        <div class="sm:col-span-2">
          <TextAreaInput
            label="When does this replacement take over?"
            bind:value={r.replacementTrigger}
            rows={2}
            onchange={changed}
            hint="Free text describing the trigger condition."
          />
        </div>
        <YesNoField label="Capacity to act?" bind:value={r.capacityDeclared} onchange={changed} />
      </div>
    </section>
  {/each}

  {#if reps.length < 4}
    <button
      type="button"
      onclick={addRep}
      class="rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
    >
      + Add replacement attorney
    </button>
  {/if}
</div>
