<script lang="ts">
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';

  const prefs = $derived(lpaStore.application.preferences);
  function changed() {
    lpaStore.recompute();
  }
  function add() {
    prefs.push({ category: '', statement: '' });
    changed();
  }
  function remove(i: number) {
    prefs.splice(i, 1);
    changed();
  }

  const CATEGORIES = [
    { value: 'residence', label: 'Residence' },
    { value: 'contact-with-others', label: 'Contact with others' },
    { value: 'religion-and-belief', label: 'Religion and belief' },
    { value: 'food-and-drink', label: 'Food and drink' },
    { value: 'end-of-life-care', label: 'End-of-life care' },
    { value: 'daily-routine', label: 'Daily routine' },
    { value: 'medical-treatment', label: 'Medical treatment' },
    { value: 'other', label: 'Other' },
  ];
</script>

<div class="space-y-4">
  <p class="text-sm text-base-content/70">
    Preferences are <strong>non-binding</strong> guidance. Attorneys should have regard to
    them but are not legally required to follow them.
  </p>

  {#each prefs as p, i (i)}
    <section class="space-y-3 rounded-lg border border-base-300 bg-base-200 p-4">
      <header class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-base-content">Preference #{i + 1}</h3>
        <button type="button" onclick={() => remove(i)} class="text-sm text-error hover:underline">
          Remove
        </button>
      </header>
      <SelectField label="Category" bind:value={p.category} options={CATEGORIES} onchange={changed} />
      <TextAreaInput label="Statement" bind:value={p.statement} rows={3} onchange={changed} />
    </section>
  {/each}

  <button
    type="button"
    onclick={add}
    class="rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
  >
    + Add preference
  </button>
</div>
