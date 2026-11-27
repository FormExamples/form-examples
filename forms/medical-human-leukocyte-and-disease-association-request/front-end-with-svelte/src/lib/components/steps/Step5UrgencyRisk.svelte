<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.urgency;
</script>

<Fieldset legend="Step 5 of 8 · Urgency and risk">
  <p class="hint">Urgent testing and high-risk samples need the laboratory warned.</p>

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

  <label class="bool-field">
    <CheckboxInput
      id="urgency-highRiskSample"
      label="The sample is high risk (labelled and packaged accordingly)"
      bind:checked={d.highRiskSample}
    />
    <span>The sample is high risk (labelled and packaged accordingly)</span>
  </label>

  <Field label="Nature of the risk" inputId="urgency-highRiskDescription">
    <TextInput
      id="urgency-highRiskDescription"
      label="Nature of the risk"
      bind:value={d.highRiskDescription}
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
