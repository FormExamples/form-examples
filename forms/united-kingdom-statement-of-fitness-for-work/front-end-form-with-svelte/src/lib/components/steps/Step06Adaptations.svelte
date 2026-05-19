<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import YesNoToggle from '$lib/components/ui/YesNoToggle.svelte';
  import { store } from '$lib/store.svelte.js';

  const showAdaptations = $derived(store.data.fitnessForWork === 'may_be_fit');
</script>

<section aria-labelledby="step6-heading">
  <h2 id="step6-heading" class="text-xl font-semibold mb-4">Step 6 — Adaptations</h2>
  {#if showAdaptations}
    <p class="text-sm text-slate-600 mb-3">
      Tick the workplace adaptations that would help the patient return to work.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field id="adapt-phased" label="Phased return to work">
        <YesNoToggle
          id="adapt-phased"
          name="adaptationPhasedReturn"
          bind:value={store.data.adaptationPhasedReturn}
        />
      </Field>
      <Field id="adapt-hours" label="Altered hours">
        <YesNoToggle
          id="adapt-hours"
          name="adaptationAlteredHours"
          bind:value={store.data.adaptationAlteredHours}
        />
      </Field>
      <Field id="adapt-duties" label="Amended duties">
        <YesNoToggle
          id="adapt-duties"
          name="adaptationAmendedDuties"
          bind:value={store.data.adaptationAmendedDuties}
        />
      </Field>
      <Field id="adapt-workplace" label="Workplace adaptations">
        <YesNoToggle
          id="adapt-workplace"
          name="adaptationWorkplaceAdaptations"
          bind:value={store.data.adaptationWorkplaceAdaptations}
        />
      </Field>
    </div>
  {:else}
    <p class="text-sm text-slate-500 italic">
      Adaptations are only applicable when "may be fit" is selected in Step 5.
    </p>
  {/if}
</section>
