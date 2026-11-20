<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import { gradeApplication } from '#lib/engine/application-grader.js';
  import { applicationClassLabel, applicationClassColor } from '#lib/engine/utils.js';

  const v = assessment.data.ceremony;
  const result = $derived(gradeApplication(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Ceremony and marriage certificate">
  <p class="hint">
    After the ceremony the officiant returns the signed license; the clerk records it and issues the
    certified marriage certificate.
  </p>

  <Field label="Ceremony date" inputId="ceremony-ceremonyDate">
    <DateInput id="ceremony-ceremonyDate" label="Ceremony date" bind:value={v.ceremonyDate} />
  </Field>
  <Field label="Who solemnized the marriage?" inputId="ceremony-officiantType">
    <Select
      id="ceremony-officiantType"
      label="Who solemnized the marriage?"
      bind:value={v.officiantType}
    >
      <option value="">— Select —</option>
      <option value="clergy">Clergy or religious officiant</option>
      <option value="judge">Judge or magistrate</option>
      <option value="clerk">Clerk or deputy clerk</option>
      <option value="notary">Notary public</option>
      <option value="self-uniting">Self-uniting (no officiant)</option>
      <option value="other">Other authorized officiant</option>
    </Select>
  </Field>
  <Field label="Officiant name" inputId="ceremony-officiantName">
    <TextInput id="ceremony-officiantName" label="Officiant name" bind:value={v.officiantName} />
  </Field>
  <Field
    label="Is the officiant authorized to solemnize marriages in this state?"
    inputId="ceremony-officiantAuthorized"
  >
    <Select
      id="ceremony-officiantAuthorized"
      label="Is the officiant authorized to solemnize marriages in this state?"
      bind:value={v.officiantAuthorized}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Witnesses present" inputId="ceremony-witnessCount">
    <NumberInput
      id="ceremony-witnessCount"
      label="Witnesses present"
      min={0}
      bind:value={v.witnessCount}
    />
  </Field>
  <Field
    label="Date the signed license was returned to the clerk"
    inputId="ceremony-licenseReturnedDate"
  >
    <DateInput
      id="ceremony-licenseReturnedDate"
      label="Date the signed license was returned to the clerk"
      bind:value={v.licenseReturnedDate}
    />
  </Field>
  <Field label="Certified copies requested" inputId="ceremony-certifiedCopiesRequested">
    <NumberInput
      id="ceremony-certifiedCopiesRequested"
      label="Certified copies requested"
      min={0}
      bind:value={v.certifiedCopiesRequested}
    />
  </Field>

  <Field label="Live eligibility status">
    <span class="inline-flex flex-wrap items-center gap-3">
      <span
        class="inline-block rounded-full border px-3 py-1 text-sm font-bold {applicationClassColor(
          result.applicationClass
        )}"
      >
        {applicationClassLabel(result.applicationClass)}
      </span>
      <span class="text-sm text-base-content/70">
        Earliest ceremony: {result.earliestCeremonyDate || 'not yet determinable'}
      </span>
      <span class="text-sm text-base-content/70">
        ({result.flaggedIssues.length} flagged {result.flaggedIssues.length === 1
          ? 'issue'
          : 'issues'})
      </span>
    </span>
  </Field>
</Fieldset>
