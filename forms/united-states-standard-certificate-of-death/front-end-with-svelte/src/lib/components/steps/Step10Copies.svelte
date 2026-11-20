<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const copies = assessment.data.copies;
</script>

<Fieldset legend="Step 10 of 11 — Certified copies">
  <p class="hint">
    Ordering certified copies from the state vital-records office. Most states limit who may obtain
    them.
  </p>

  <Field label="Number of certified copies" inputId="copies-certifiedCopiesRequested">
    <NumberInput
      id="copies-certifiedCopiesRequested"
      label="Number of certified copies"
      min={0}
      max={100}
      bind:value={copies.certifiedCopiesRequested}
    />
  </Field>

  <Field label="Requester’s relationship to the decedent" inputId="copies-requesterRelationship">
    <Select
      id="copies-requesterRelationship"
      label="Requester’s relationship to the decedent"
      bind:value={copies.requesterRelationship}
    >
      <option value="">— Select —</option>
      <option value="spouse">Spouse</option>
      <option value="child">Child</option>
      <option value="parent">Parent</option>
      <option value="sibling">Sibling</option>
      <option value="legal-representative">Legal representative or executor</option>
      <option value="funeral-director">Funeral director</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="Requester’s identity and eligibility verified?"
    inputId="copies-requesterIdentityVerified"
  >
    <Select
      id="copies-requesterIdentityVerified"
      label="Requester’s identity and eligibility verified?"
      bind:value={copies.requesterIdentityVerified}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Total fee paid (US dollars)" inputId="copies-feePaidInUsd">
    <NumberInput
      id="copies-feePaidInUsd"
      label="Total fee paid (US dollars)"
      min={0}
      step="0.01"
      bind:value={copies.feePaidInUsd}
    />
  </Field>
</Fieldset>
