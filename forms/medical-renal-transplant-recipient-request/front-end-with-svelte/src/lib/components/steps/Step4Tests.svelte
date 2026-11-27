<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import { TEST_DEFINITIONS } from '#lib/engine/tests.js';
  import type { TestDefinition } from '#lib/engine/types.js';

  const d = assessment.data.tests;

  const dfppOptions = [
    { value: 'pre-dfpp', label: 'Pre-DFPP' },
    { value: 'post-dfpp', label: 'Post-DFPP' },
    { value: 'no-dfpp', label: 'No DFPP' }
  ];

  // The catalogue grouped for display, in catalogue order.
  const groups: { name: string; tests: TestDefinition[] }[] = [];
  for (const def of TEST_DEFINITIONS) {
    const last = groups[groups.length - 1];
    if (last && last.name === def.group) last.tests.push(def);
    else groups.push({ name: def.group, tests: [def] });
  }
</script>

<Fieldset legend="Step 4 of 7 · Tests required">
  <p class="hint">
    Tick every test required. The sample tubes needed are worked out from your choices.
  </p>

  {#each groups as group (group.name)}
    <h3 class="subhead">{group.name}</h3>
    {#each group.tests as def (def.field)}
      <label class="bool-field">
        <CheckboxInput id={`tests-${def.field}`} label={def.label} bind:checked={d[def.field]} />
        <span>{def.label}</span>
      </label>
    {/each}
  {/each}

  <Field
    label="Test detail (for example the specific test when other is ticked)"
    inputId="tests-testDetail"
  >
    <TextInput id="tests-testDetail" label="Test detail" bind:value={d.testDetail} />
  </Field>

  <Field label="DFPP status (ABO-incompatible monitoring)" inputId="tests-dfppStatus">
    <Select id="tests-dfppStatus" label="DFPP status" bind:value={d.dfppStatus}>
      <option value="">— Select —</option>
      {#each dfppOptions as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </Select>
  </Field>

  <Field
    label="Transfusion date(s) and number (post-transfusion monitoring)"
    inputId="tests-postTransfusionDatesAndNumber"
  >
    <TextInput
      id="tests-postTransfusionDatesAndNumber"
      label="Transfusion dates and number"
      bind:value={d.postTransfusionDatesAndNumber}
    />
  </Field>

  <Field label="Donor reference (if any)" inputId="tests-donorReference">
    <TextInput id="tests-donorReference" label="Donor reference" bind:value={d.donorReference} />
  </Field>

  <h3 class="subhead">Urgency</h3>
  <label class="bool-field">
    <CheckboxInput
      id="tests-urgentTesting"
      label="Sample requires urgent testing"
      bind:checked={d.urgentTesting}
    />
    <span>Sample requires urgent testing</span>
  </label>
  <Field label="Reason for urgent testing" inputId="tests-urgentTestingReason">
    <TextInput
      id="tests-urgentTestingReason"
      label="Reason for urgent testing"
      bind:value={d.urgentTestingReason}
    />
  </Field>
</Fieldset>

<style>
  .subhead {
    margin: 1rem 0 0.25rem;
    font-weight: 600;
  }
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
