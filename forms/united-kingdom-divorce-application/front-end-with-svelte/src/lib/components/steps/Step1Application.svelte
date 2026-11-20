<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const a = assessment.data.application;
</script>

<Fieldset legend="Step 1 of 7 — Application type and stage">
  <p class="hint">
    What you are applying for, whether alone or jointly, which stage you are checking, and the date
    of the check.
  </p>

  <Field label="Type of application" inputId="application-applicationType">
    <Select
      id="application-applicationType"
      label="Type of application"
      bind:value={a.applicationType}
    >
      <option value="">— Select —</option>
      <option value="divorce">Divorce (marriage)</option>
      <option value="dissolution">Dissolution of a civil partnership</option>
    </Select>
  </Field>

  <Field label="Sole or joint application?" inputId="application-applicationMode">
    <Select
      id="application-applicationMode"
      label="Sole or joint application?"
      bind:value={a.applicationMode}
    >
      <option value="">— Select —</option>
      <option value="sole">Sole application (one of you applies)</option>
      <option value="joint">Joint application (both of you apply together)</option>
    </Select>
  </Field>
  <p class="hint">
    A joint application needs both spouses to agree and is not suitable where there is a risk of
    domestic abuse.
  </p>

  <Field label="Stage you are checking" inputId="application-stage">
    <Select id="application-stage" label="Stage you are checking" bind:value={a.stage}>
      <option value="">— Select —</option>
      <option value="application">Application for a divorce (form D8 or online)</option>
      <option value="conditional-order">Conditional order (form D84)</option>
      <option value="final-order">Final order (form D36)</option>
    </Select>
  </Field>
  <p class="hint">
    The application, then the conditional order after a 20-week reflection period, then the final
    order 6 weeks and 1 day later.
  </p>

  <Field label="Date of this check" inputId="application-asOfDate">
    <DateInput id="application-asOfDate" label="Date of this check" bind:value={a.asOfDate} />
  </Field>
  <p class="hint">The time gates are tested against this date, so the result is reproducible.</p>

  <Field label="Is there a risk of domestic abuse?" inputId="application-domesticAbuseRisk">
    <Select
      id="application-domesticAbuseRisk"
      label="Is there a risk of domestic abuse?"
      bind:value={a.domesticAbuseRisk}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
