<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const m = assessment.data.marriage;
</script>

<Fieldset legend="Step 2 of 7 — Marriage and certificate">
  <p class="hint">
    When and where you married, whether the marriage is recognized, and the certificate and any name
    change.
  </p>

  <Field label="Date of the marriage or civil partnership" inputId="marriage-marriageDate">
    <DateInput
      id="marriage-marriageDate"
      label="Date of the marriage or civil partnership"
      bind:value={m.marriageDate}
    />
  </Field>
  <p class="hint">You must have been married for at least one year before you can apply.</p>

  <Field label="Place of the marriage" inputId="marriage-marriagePlace">
    <TextInput
      id="marriage-marriagePlace"
      label="Place of the marriage"
      bind:value={m.marriagePlace}
    />
  </Field>

  <Field label="Country of the marriage" inputId="marriage-marriageCountry">
    <TextInput
      id="marriage-marriageCountry"
      label="Country of the marriage"
      bind:value={m.marriageCountry}
    />
  </Field>

  <Field
    label="Is the marriage or civil partnership legally recognised in the UK?"
    inputId="marriage-legallyRecognised"
  >
    <Select
      id="marriage-legallyRecognised"
      label="Is the marriage or civil partnership legally recognised in the UK?"
      bind:value={m.legallyRecognised}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Has the relationship broken down irretrievably?"
    inputId="marriage-breakdownConfirmed"
  >
    <Select
      id="marriage-breakdownConfirmed"
      label="Has the relationship broken down irretrievably?"
      bind:value={m.breakdownConfirmed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">This is the only ground. You do not need to give a reason or blame anyone.</p>

  <Field label="Marriage certificate held" inputId="marriage-marriageCertificateType">
    <Select
      id="marriage-marriageCertificateType"
      label="Marriage certificate held"
      bind:value={m.marriageCertificateType}
    >
      <option value="">— Select —</option>
      <option value="original">Original certificate</option>
      <option value="certified-copy">Certified copy</option>
      <option value="not-held">Not held</option>
    </Select>
  </Field>
  <p class="hint">The original certificate or a certified copy is required.</p>

  <Field label="Is the marriage certificate in English?" inputId="marriage-certificateInEnglish">
    <Select
      id="marriage-certificateInEnglish"
      label="Is the marriage certificate in English?"
      bind:value={m.certificateInEnglish}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Do you hold a certified translation?" inputId="marriage-certifiedTranslation">
    <Select
      id="marriage-certifiedTranslation"
      label="Do you hold a certified translation?"
      bind:value={m.certifiedTranslation}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">Needed when the certificate is not in English.</p>

  <Field label="Has your name changed since the marriage?" inputId="marriage-nameChanged">
    <Select
      id="marriage-nameChanged"
      label="Has your name changed since the marriage?"
      bind:value={m.nameChanged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Proof of the name change" inputId="marriage-nameChangeProof">
    <Select
      id="marriage-nameChangeProof"
      label="Proof of the name change"
      bind:value={m.nameChangeProof}
    >
      <option value="">— Select —</option>
      <option value="marriage-certificate">Marriage certificate</option>
      <option value="deed-poll">Deed poll</option>
      <option value="none">No proof held</option>
    </Select>
  </Field>
</Fieldset>
