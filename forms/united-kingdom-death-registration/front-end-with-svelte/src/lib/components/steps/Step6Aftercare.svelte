<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.aftercare;
</script>

<Fieldset legend="Step 6 of 6 — After registration">
  <p class="hint">
    The certificate for burial or cremation, Tell Us Once, and certified copies of the death
    certificate.
  </p>

  <Field label="Intended disposal" inputId="aftercare-disposalMethod">
    <Select id="aftercare-disposalMethod" label="Intended disposal" bind:value={p.disposalMethod}>
      <option value="">— Select —</option>
      <option value="burial">Burial</option>
      <option value="cremation">Cremation</option>
      <option value="other">Other</option>
      <option value="undecided">Not yet decided</option>
    </Select>
  </Field>
  <Field
    label="Certificate for burial or cremation (green form) issued?"
    inputId="aftercare-disposalCertificateIssued"
  >
    <Select
      id="aftercare-disposalCertificateIssued"
      label="Certificate for burial or cremation (green form) issued?"
      bind:value={p.disposalCertificateIssued}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Tell Us Once" inputId="aftercare-tellUsOnceStatus">
    <Select id="aftercare-tellUsOnceStatus" label="Tell Us Once" bind:value={p.tellUsOnceStatus}>
      <option value="">— Select —</option>
      <option value="reference-received">Reference number received</option>
      <option value="not-offered">Not offered</option>
      <option value="declined">Declined</option>
    </Select>
  </Field>
  <Field label="Tell Us Once reference number" inputId="aftercare-tellUsOnceReference">
    <TextInput
      id="aftercare-tellUsOnceReference"
      label="Tell Us Once reference number"
      placeholder=""
      bind:value={p.tellUsOnceReference}
    />
  </Field>
  <Field label="Certified copies requested" inputId="aftercare-copiesRequested">
    <NumberInput
      id="aftercare-copiesRequested"
      label="Certified copies requested"
      min={0}
      max={50}
      bind:value={p.copiesRequested}
    />
  </Field>
  <Field label="How are copies ordered?" inputId="aftercare-copyOrderChannel">
    <Select
      id="aftercare-copyOrderChannel"
      label="How are copies ordered?"
      bind:value={p.copyOrderChannel}
    >
      <option value="">— Select —</option>
      <option value="at-registration">At registration</option>
      <option value="gro-online">General Register Office - online</option>
      <option value="phone">General Register Office - phone</option>
      <option value="post">General Register Office - post</option>
      <option value="local-register-office">Local register office</option>
    </Select>
  </Field>
  <Field label="GRO index reference" inputId="aftercare-groIndexReference">
    <TextInput
      id="aftercare-groIndexReference"
      label="GRO index reference"
      placeholder=""
      bind:value={p.groIndexReference}
    />
  </Field>
  <Field label="Priority service (next working day)?" inputId="aftercare-priorityService">
    <Select
      id="aftercare-priorityService"
      label="Priority service (next working day)?"
      bind:value={p.priorityService}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
