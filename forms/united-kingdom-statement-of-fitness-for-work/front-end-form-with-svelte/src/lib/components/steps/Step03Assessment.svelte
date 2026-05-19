<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import YesNoToggle from '$lib/components/ui/YesNoToggle.svelte';
  import { store } from '$lib/store.svelte.js';
  import { ASSESSMENT_METHODS } from '$lib/types.js';
</script>

<section aria-labelledby="step3-heading">
  <h2 id="step3-heading" class="text-xl font-semibold mb-4">Step 3 — Assessment</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field id="assessment-date" label="Assessment date">
      <input
        id="assessment-date"
        type="date"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.assessmentDate}
      />
    </Field>
    <Field id="assessment-method" label="Assessment method">
      <select
        id="assessment-method"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.assessmentMethod}
      >
        <option value="">—</option>
        {#each ASSESSMENT_METHODS as m (m.value)}
          <option value={m.value}>{m.label}</option>
        {/each}
      </select>
    </Field>
    <Field
      id="general-fitness-considered"
      label="General fitness considered?"
      hint="DWP guidance: consider impact of the condition on the person's overall ability to work, not just on a specific task."
    >
      <YesNoToggle
        id="general-fitness-considered"
        name="generalFitnessConsidered"
        bind:value={store.data.generalFitnessConsidered}
      />
    </Field>
  </div>
</section>
