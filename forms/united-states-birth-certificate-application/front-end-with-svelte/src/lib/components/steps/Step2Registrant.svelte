<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const r = assessment.data.registrant;
</script>

<Fieldset legend="Step 2 of 6 — Person named on the certificate">
  <p class="hint">
    The data of the US Standard Certificate of Live Birth that the vital records office needs to
    find the record. There is no national registry: the state or territory of birth issues the
    certificate (CDC/NCHS Where to Write for Vital Records).
  </p>

  <Field label="Full name at birth" inputId="registrant-registrantName">
    <TextInput
      id="registrant-registrantName"
      label="Full name at birth"
      placeholder="Full name as on the certificate"
      bind:value={r.registrantName}
    />
  </Field>

  <Field label="Sex on the certificate" inputId="registrant-sex">
    <Select id="registrant-sex" label="Sex on the certificate" bind:value={r.sex}>
      <option value="">— Select —</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="other">Other</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>

  <Field label="Date of birth" inputId="registrant-dateOfBirth">
    <DateInput id="registrant-dateOfBirth" label="Date of birth" bind:value={r.dateOfBirth} />
  </Field>

  <Field label="City or town of birth" inputId="registrant-placeOfBirth">
    <TextInput
      id="registrant-placeOfBirth"
      label="City or town of birth"
      bind:value={r.placeOfBirth}
    />
  </Field>

  <Field label="County of birth" inputId="registrant-countyOfBirth">
    <TextInput id="registrant-countyOfBirth" label="County of birth" bind:value={r.countyOfBirth} />
  </Field>

  <Field label="State or territory of birth (2-letter code)" inputId="registrant-state">
    <TextInput
      id="registrant-state"
      label="State or territory of birth (2-letter code)"
      placeholder="e.g. TX"
      bind:value={r.state}
    />
  </Field>

  <Field label="Hospital or facility of birth" inputId="registrant-birthFacility">
    <TextInput
      id="registrant-birthFacility"
      label="Hospital or facility of birth"
      bind:value={r.birthFacility}
    />
  </Field>

  <Field
    label="Mother's full name before first marriage"
    inputId="registrant-motherNameBeforeFirstMarriage"
  >
    <TextInput
      id="registrant-motherNameBeforeFirstMarriage"
      label="Mother's full name before first marriage"
      bind:value={r.motherNameBeforeFirstMarriage}
    />
  </Field>

  <Field label="Father's or second parent's full name" inputId="registrant-fatherName">
    <TextInput
      id="registrant-fatherName"
      label="Father's or second parent's full name"
      bind:value={r.fatherName}
    />
  </Field>

  <Field label="Is the person named deceased?" inputId="registrant-deceased">
    <Select id="registrant-deceased" label="Is the person named deceased?" bind:value={r.deceased}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Was the person named adopted?" inputId="registrant-adopted">
    <Select id="registrant-adopted" label="Was the person named adopted?" bind:value={r.adopted}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
