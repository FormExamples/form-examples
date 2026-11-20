<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const certifier = assessment.data.certifier;
</script>

<Fieldset legend="Step 3 of 11 — Certifier">
  <p class="hint">
    The person who completes the cause-of-death section: attending or pronouncing physician, medical
    examiner, or coroner.
  </p>

  <Field label="Certifier: name" inputId="certifier-certifierName">
    <TextInput
      id="certifier-certifierName"
      label="Certifier: name"
      placeholder="Name of the certifier"
      bind:value={certifier.certifierName}
    />
  </Field>

  <Field label="Certifier type" inputId="certifier-certifierType">
    <Select
      id="certifier-certifierType"
      label="Certifier type"
      bind:value={certifier.certifierType}
    >
      <option value="">— Select —</option>
      <option value="certifying-physician">Certifying physician</option>
      <option value="pronouncing-and-certifying-physician">
        Pronouncing and certifying physician
      </option>
      <option value="medical-examiner">Medical examiner</option>
      <option value="coroner">Coroner</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="State license number" inputId="certifier-certifierLicenseNumber">
    <TextInput
      id="certifier-certifierLicenseNumber"
      label="State license number"
      placeholder="e.g. A123456"
      bind:value={certifier.certifierLicenseNumber}
    />
  </Field>

  <Field label="Date certified" inputId="certifier-certificationDate">
    <DateInput
      id="certifier-certificationDate"
      label="Date certified"
      bind:value={certifier.certificationDate}
    />
  </Field>

  <Field
    label="Attended the decedent during the last illness?"
    inputId="certifier-attendedDeceased"
  >
    <Select
      id="certifier-attendedDeceased"
      label="Attended the decedent during the last illness?"
      bind:value={certifier.attendedDeceased}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Date last seen alive by the certifier" inputId="certifier-lastSeenAliveDate">
    <DateInput
      id="certifier-lastSeenAliveDate"
      label="Date last seen alive by the certifier"
      bind:value={certifier.lastSeenAliveDate}
    />
  </Field>
</Fieldset>
