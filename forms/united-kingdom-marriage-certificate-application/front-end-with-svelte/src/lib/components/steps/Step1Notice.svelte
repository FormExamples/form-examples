<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const v = assessment.data.notice;
</script>

<Fieldset legend="Step 1 of 6 — The notice">
  <p class="hint">
    Giving notice of marriage or civil partnership at your local register office, at least 29 days
    before the ceremony.
  </p>

  <Field label="Marriage or civil partnership?" inputId="notice-noticeType">
    <Select id="notice-noticeType" label="Marriage or civil partnership?" bind:value={v.noticeType}>
      <option value="">— Select —</option>
      <option value="marriage">Marriage</option>
      <option value="civil-partnership">Civil partnership</option>
    </Select>
  </Field>

  <Field label="Date notice is given" inputId="notice-noticeDate">
    <DateInput id="notice-noticeDate" label="Date notice is given" bind:value={v.noticeDate} />
  </Field>

  <Field label="Registration district" inputId="notice-registrationDistrict">
    <TextInput
      id="notice-registrationDistrict"
      label="Registration district"
      placeholder="e.g. Leeds"
      bind:value={v.registrationDistrict}
    />
  </Field>

  <Field
    label="Will both parties give notice together at one register office?"
    inputId="notice-noticeGivenTogether"
  >
    <Select
      id="notice-noticeGivenTogether"
      label="Will both parties give notice together at one register office?"
      bind:value={v.noticeGivenTogether}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
