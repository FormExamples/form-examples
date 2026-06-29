<script lang="ts">
  import FormField from '$lib/components/ui/FormField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';
  import { emptyPersonToNotify } from '$lib/engine/factory.js';

  const ppl = $derived(lpaStore.application.peopleToNotify);
  function changed() {
    lpaStore.recompute();
  }
  function add() {
    if (ppl.length < 5) {
      ppl.push(emptyPersonToNotify());
      changed();
    }
  }
  function remove(i: number) {
    ppl.splice(i, 1);
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
    0 to 5 people to be notified when this LPA is registered with the OPG (LP1H s.6).
  </p>

  {#each ppl as p, i (i)}
    <section class="rounded-lg border border-base-300 bg-base-200 p-4">
      <header class="mb-3 flex items-center justify-between">
        <h3 class="font-medium text-base-content">Person to notify #{i + 1}</h3>
        <button type="button" onclick={() => remove(i)} class="text-sm text-error hover:underline">
          Remove
        </button>
      </header>
      <div class="grid gap-3 sm:grid-cols-2">
        <FormField label="Given names" bind:value={p.givenNames} onchange={changed} />
        <FormField label="Family name" bind:value={p.familyName} onchange={changed} />
        <SelectField
          label="Relationship to donor"
          bind:value={p.relationshipToDonor}
          options={RELATIONSHIPS}
          onchange={changed}
        />
        <FormField label="Email" type="email" bind:value={p.email} onchange={changed} />
        <div class="sm:col-span-2">
          <FormField
            label="Postal address"
            bind:value={p.postalAddressAsFullText}
            onchange={changed}
          />
        </div>
      </div>
    </section>
  {/each}

  {#if ppl.length < 5}
    <button
      type="button"
      onclick={add}
      class="rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
    >
      + Add person to notify
    </button>
  {/if}
</div>
