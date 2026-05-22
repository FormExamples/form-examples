<script lang="ts">
  import FormField from '$lib/components/ui/FormField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';
  import { emptyAttorney } from '$lib/engine/factory.js';

  const attorneys = $derived(lpaStore.application.attorneys);
  function changed() {
    lpaStore.recompute();
  }
  function addAttorney() {
    if (attorneys.length < 4) {
      attorneys.push(emptyAttorney());
      changed();
    }
  }
  function removeAttorney(i: number) {
    attorneys.splice(i, 1);
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
  <p class="text-sm text-slate-600">
    Name 1 to 4 attorneys. Each attorney must be ≥ 18 and have capacity to act (MCA 2005 s.10).
  </p>

  {#each attorneys as att, i (i)}
    <section class="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <header class="mb-3 flex items-center justify-between">
        <h3 class="font-medium text-slate-900">Attorney #{i + 1}</h3>
        <button
          type="button"
          onclick={() => removeAttorney(i)}
          class="text-sm text-red-600 hover:underline"
        >
          Remove
        </button>
      </header>
      <div class="grid gap-3 sm:grid-cols-2">
        <FormField label="Given names" required bind:value={att.givenNames} onchange={changed} />
        <FormField label="Family name" required bind:value={att.familyName} onchange={changed} />
        <FormField label="Date of birth" type="date" required bind:value={att.birthDate} onchange={changed} />
        <SelectField
          label="Relationship to donor"
          bind:value={att.relationshipToDonor}
          options={RELATIONSHIPS}
          onchange={changed}
        />
        <div class="sm:col-span-2">
          <FormField
            label="Postal address"
            bind:value={att.postalAddressAsFullText}
            onchange={changed}
          />
        </div>
        <FormField label="Email" type="email" bind:value={att.email} onchange={changed} />
        <FormField label="Telephone" type="tel" bind:value={att.phone} onchange={changed} />
        <YesNoField
          label="Bankrupt?"
          bind:value={att.isBankrupt}
          hint="Informational only — bankruptcy bar applies to P&FA LPAs."
          onchange={changed}
        />
        <YesNoField
          label="Capacity to act?"
          bind:value={att.capacityDeclared}
          onchange={changed}
        />
      </div>
    </section>
  {/each}

  {#if attorneys.length < 4}
    <button
      type="button"
      onclick={addAttorney}
      class="rounded border border-brand-500 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
    >
      + Add attorney
    </button>
  {/if}
</div>
