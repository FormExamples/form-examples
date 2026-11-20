<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.spouses;
</script>

<Fieldset legend="Step 2 of 6 — Spouses and residency">
  <p class="hint">
    The parties, the marriage, separation, and how long the petitioner has lived in the state and
    county.
  </p>

  <Field label="Petitioner (filing spouse) — full legal name" inputId="spouses-petitionerName">
    <TextInput
      id="spouses-petitionerName"
      label="Petitioner (filing spouse) — full legal name"
      bind:value={s.petitionerName}
    />
  </Field>

  <Field label="Respondent (other spouse) — full legal name" inputId="spouses-respondentName">
    <TextInput
      id="spouses-respondentName"
      label="Respondent (other spouse) — full legal name"
      bind:value={s.respondentName}
    />
  </Field>

  <Field label="Date of marriage" inputId="spouses-marriageDate">
    <DateInput id="spouses-marriageDate" label="Date of marriage" bind:value={s.marriageDate} />
  </Field>

  <Field label="Place of marriage" inputId="spouses-marriagePlace">
    <TextInput id="spouses-marriagePlace" label="Place of marriage" bind:value={s.marriagePlace} />
  </Field>

  <Field label="Date spouses began living separate and apart" inputId="spouses-separationDate">
    <DateInput
      id="spouses-separationDate"
      label="Date spouses began living separate and apart"
      bind:value={s.separationDate}
    />
  </Field>

  <Field
    label="Petitioner months of residency in the filing state"
    inputId="spouses-petitionerResidencyMonths"
  >
    <NumberInput
      id="spouses-petitionerResidencyMonths"
      label="Petitioner months of residency in the filing state"
      min={0}
      max={1200}
      bind:value={s.petitionerResidencyMonths}
    />
  </Field>

  <Field
    label="Petitioner days of residency in the filing county"
    inputId="spouses-countyResidencyDays"
  >
    <NumberInput
      id="spouses-countyResidencyDays"
      label="Petitioner days of residency in the filing county"
      min={0}
      max={36500}
      bind:value={s.countyResidencyDays}
    />
  </Field>

  <Field
    label="Married in, or lived together as spouses in, the filing state?"
    inputId="spouses-marriedOrLivedInState"
  >
    <Select
      id="spouses-marriedOrLivedInState"
      label="Married in, or lived together as spouses in, the filing state?"
      bind:value={s.marriedOrLivedInState}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Is the respondent on active military duty?" inputId="spouses-respondentMilitary">
    <Select
      id="spouses-respondentMilitary"
      label="Is the respondent on active military duty?"
      bind:value={s.respondentMilitary}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
