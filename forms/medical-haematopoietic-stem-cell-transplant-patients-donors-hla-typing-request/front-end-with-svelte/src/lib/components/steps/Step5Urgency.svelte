<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.urgency;
</script>

<Fieldset legend="Step 5 of 8 · Urgency">
  <p class="hint">Urgent testing needs a reason and a telephone call to the laboratory.</p>

  <label class="bool-field">
    <CheckboxInput
      id="urgency-urgentTesting"
      label="Sample requires urgent testing"
      bind:checked={d.urgentTesting}
    />
    <span>Sample requires urgent testing</span>
  </label>

  <Field label="Reason for urgent testing" inputId="urgency-urgentTestingReason">
    <TextInput
      id="urgency-urgentTestingReason"
      label="Reason for urgent testing"
      bind:value={d.urgentTestingReason}
    />
  </Field>
</Fieldset>

<style>
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
