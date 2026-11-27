<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import { TEST_DEFINITIONS } from '#lib/engine/tests.js';

  const d = assessment.data.tests;
</script>

<Fieldset legend="Step 3 of 8 · Tests required">
  <p class="hint">Tick every test required. One EDTA tube serves all of them.</p>

  {#each TEST_DEFINITIONS as def (def.field)}
    <label class="bool-field">
      <CheckboxInput id={`tests-${def.field}`} label={def.label} bind:checked={d[def.field]} />
      <span>{def.label} ({def.use})</span>
    </label>
  {/each}

  <Field label="Allele or antigen (when other is ticked)" inputId="tests-testDetail">
    <TextInput id="tests-testDetail" label="Allele or antigen" bind:value={d.testDetail} />
  </Field>
</Fieldset>

<style>
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
