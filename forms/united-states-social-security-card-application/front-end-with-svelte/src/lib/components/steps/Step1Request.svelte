<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { OPTIONS } from '#lib/engine/utils.js';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const v = assessment.data.request;
</script>

<Fieldset legend="Step 1 of 6 — What you are requesting">
  <p class="hint">
    The type of card, how the application is submitted, and the replacement history that decides the
    3-per-year and 10-per-lifetime limits.
  </p>

  <Field label="Type of request" inputId="request-requestType">
    <Select id="request-requestType" label="Type of request" bind:value={v.requestType}>
      <option value="">— Select —</option>
      {#each OPTIONS.requestType as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field label="Application date (item 15)" inputId="request-applicationDate">
    <DateInput
      id="request-applicationDate"
      label="Application date (item 15)"
      bind:value={v.applicationDate}
    />
  </Field>
  <Field label="How the application is submitted" inputId="request-channel">
    <Select id="request-channel" label="How the application is submitted" bind:value={v.channel}>
      <option value="">— Select —</option>
      {#each OPTIONS.channel as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">
    An applicant aged 12 or older requesting an original card must apply in person.
  </p>
  <Field
    label="Has anyone ever applied for or received a Social Security number for this person? (item 12)"
    inputId="request-previouslyApplied"
  >
    <Select
      id="request-previouslyApplied"
      label="Has anyone ever applied for or received a Social Security number for this person? (item 12)"
      bind:value={v.previouslyApplied}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNoUnknown as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field label="Has the name changed because of a legal name change?" inputId="request-nameChange">
    <Select
      id="request-nameChange"
      label="Has the name changed because of a legal name change?"
      bind:value={v.nameChange}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">A legal name change does not count toward the replacement-card limits.</p>
  <Field label="Reason for the name change" inputId="request-nameChangeReason">
    <Select
      id="request-nameChangeReason"
      label="Reason for the name change"
      bind:value={v.nameChangeReason}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.nameChangeReason as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field
    label="Does this request correct the date of birth SSA holds?"
    inputId="request-dateOfBirthCorrection"
  >
    <Select
      id="request-dateOfBirthCorrection"
      label="Does this request correct the date of birth SSA holds?"
      bind:value={v.dateOfBirthCorrection}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field
    label="Replacement cards already issued this calendar year"
    inputId="request-replacementsThisYear"
  >
    <NumberInput
      id="request-replacementsThisYear"
      label="Replacement cards already issued this calendar year"
      min={0}
      max={99}
      bind:value={v.replacementsThisYear}
    />
  </Field>
  <p class="hint">Limit: 3 per calendar year. Count replacements only, not the original card.</p>
  <Field
    label="Replacement cards already issued in a lifetime"
    inputId="request-replacementsLifetime"
  >
    <NumberInput
      id="request-replacementsLifetime"
      label="Replacement cards already issued in a lifetime"
      min={0}
      max={99}
      bind:value={v.replacementsLifetime}
    />
  </Field>
  <p class="hint">Limit: 10 per lifetime.</p>
  <Field label="Exception reason if a limit is reached" inputId="request-limitExceptionReason">
    <Select
      id="request-limitExceptionReason"
      label="Exception reason if a limit is reached"
      bind:value={v.limitExceptionReason}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.limitExceptionReason as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">Name change, legend change, non-receipt, SSA error, or hardship.</p>
  <Field
    label="Do you have documents supporting that exception?"
    inputId="request-limitExceptionEvidence"
  >
    <Select
      id="request-limitExceptionEvidence"
      label="Do you have documents supporting that exception?"
      bind:value={v.limitExceptionEvidence}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
</Fieldset>
