<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.lab;
</script>

<Fieldset legend="Step 7 of 7 · Laboratory use and submit">
  <p class="hint">
    Optional: completed by the receiving laboratory. Submit to compute the four-axis grade and
    flags.
  </p>

  <div class="field-grid">
    <Field label="Donor identifier" inputId="lab-laboratoryDonorIdentifier">
      <TextInput
        id="lab-laboratoryDonorIdentifier"
        label="Donor identifier"
        bind:value={d.laboratoryDonorIdentifier}
      />
    </Field>
    <Field label="Recipient identifier" inputId="lab-laboratoryRecipientIdentifier">
      <TextInput
        id="lab-laboratoryRecipientIdentifier"
        label="Recipient identifier"
        bind:value={d.laboratoryRecipientIdentifier}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Sample number" inputId="lab-laboratorySampleNumber">
      <TextInput
        id="lab-laboratorySampleNumber"
        label="Sample number"
        bind:value={d.laboratorySampleNumber}
      />
    </Field>
    <Field label="Received at" inputId="lab-laboratorySampleReceivedAt">
      <TextInput
        id="lab-laboratorySampleReceivedAt"
        label="Received at"
        type="datetime-local"
        bind:value={d.laboratorySampleReceivedAt}
      />
    </Field>
  </div>

  <Field label="Sample identifiers checked by" inputId="lab-laboratoryIdentifiersCheckedBy">
    <TextInput
      id="lab-laboratoryIdentifiersCheckedBy"
      label="Sample identifiers checked by"
      bind:value={d.laboratoryIdentifiersCheckedBy}
    />
  </Field>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
