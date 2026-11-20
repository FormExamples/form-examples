<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.execution;
</script>

<Fieldset legend="Step 5 of 6 — Execution and witnesses">
  <p class="hint">
    How the will will be signed. A witnessed will needs the testator's signature at the end and,
    normally, two adult witnesses who watch the signing. Witnesses should take nothing under the
    will.
  </p>

  <Field label="Form of execution" inputId="execution-executionForm">
    <Select id="execution-executionForm" label="Form of execution" bind:value={p.executionForm}>
      <option value="">— Select —</option>
      <option value="witnessed">Witnessed will (two witnesses)</option>
      <option value="holographic">Holographic (handwritten, unwitnessed) will</option>
      <option value="electronic">Electronic will</option>
    </Select>
  </Field>

  <Field label="Execution date" inputId="execution-executionDate">
    <DateInput id="execution-executionDate" label="Execution date" bind:value={p.executionDate} />
  </Field>

  <Field label="Does the testator sign at the end of the will?" inputId="execution-signedAtEnd">
    <Select
      id="execution-signedAtEnd"
      label="Does the testator sign at the end of the will?"
      bind:value={p.signedAtEnd}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Does the testator sign, or acknowledge the signature, in front of the witnesses?"
    inputId="execution-signedInWitnessPresence"
  >
    <Select
      id="execution-signedInWitnessPresence"
      label="Does the testator sign, or acknowledge the signature, in front of the witnesses?"
      bind:value={p.signedInWitnessPresence}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Do the witnesses sign in the testator's presence?"
    inputId="execution-witnessesSignedInTestatorPresence"
  >
    <Select
      id="execution-witnessesSignedInTestatorPresence"
      label="Do the witnesses sign in the testator's presence?"
      bind:value={p.witnessesSignedInTestatorPresence}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Holographic will: are the signature and material provisions in the testator's own handwriting?"
    inputId="execution-holographicEntirelyHandwritten"
  >
    <Select
      id="execution-holographicEntirelyHandwritten"
      label="Holographic will: are the signature and material provisions in the testator's own handwriting?"
      bind:value={p.holographicEntirelyHandwritten}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Witness 1 — name" inputId="execution-witness1Name">
    <TextInput id="execution-witness1Name" label="Witness 1 — name" bind:value={p.witness1Name} />
  </Field>

  <Field label="Witness 1 — takes a gift under the will?" inputId="execution-witness1Beneficiary">
    <Select
      id="execution-witness1Beneficiary"
      label="Witness 1 — takes a gift under the will?"
      bind:value={p.witness1Beneficiary}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Witness 2 — name" inputId="execution-witness2Name">
    <TextInput id="execution-witness2Name" label="Witness 2 — name" bind:value={p.witness2Name} />
  </Field>

  <Field label="Witness 2 — takes a gift under the will?" inputId="execution-witness2Beneficiary">
    <Select
      id="execution-witness2Beneficiary"
      label="Witness 2 — takes a gift under the will?"
      bind:value={p.witness2Beneficiary}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Witness 3 — name (optional extra witness)" inputId="execution-witness3Name">
    <TextInput
      id="execution-witness3Name"
      label="Witness 3 — name (optional extra witness)"
      bind:value={p.witness3Name}
    />
  </Field>

  <Field label="Witness 3 — takes a gift under the will?" inputId="execution-witness3Beneficiary">
    <Select
      id="execution-witness3Beneficiary"
      label="Witness 3 — takes a gift under the will?"
      bind:value={p.witness3Beneficiary}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
