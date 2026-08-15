<script lang="ts">
  import { store } from '#lib/stores/checklist.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import EmailInput from '#lib/components/ui/EmailInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 1 — Respondent identification">
  <p class="hint">
    Tell us who is completing this checklist and which team or organisation you
    are scoring. None of these fields affect the maturity calculation.
  </p>

  <div class="field-grid">
    <Field label="Full name" inputId="respondent-fullName">
      <TextInput
        id="respondent-fullName"
        label="Full name"
        bind:value={store.data.respondent.fullName}
      />
    </Field>
    <Field label="Email" inputId="respondent-email">
      <EmailInput
        id="respondent-email"
        label="Email"
        bind:value={store.data.respondent.email}
      />
    </Field>
    <Field label="Role" inputId="respondent-role">
      <Select id="respondent-role" label="Role" bind:value={store.data.respondent.role}>
        <option value="">—</option>
        <option value="team-member">Team member</option>
        <option value="team-lead">Team lead</option>
        <option value="scrum-master">Scrum master</option>
        <option value="product-owner">Product owner</option>
        <option value="engineering-manager">Engineering manager</option>
        <option value="agile-coach">Agile coach</option>
        <option value="executive-sponsor">Executive sponsor</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Years working in agile environments" inputId="respondent-yearsInAgile">
      <NumberInput
        id="respondent-yearsInAgile"
        label="Years working in agile environments"
        min={0}
        max={50}
        bind:value={store.data.respondent.yearsInAgile}
      />
    </Field>
    <Field label="Team being assessed" inputId="respondent-teamName">
      <TextInput
        id="respondent-teamName"
        label="Team being assessed"
        bind:value={store.data.respondent.teamName}
      />
    </Field>
    <Field label="Organisation / programme" inputId="respondent-organisationName">
      <TextInput
        id="respondent-organisationName"
        label="Organisation / programme"
        bind:value={store.data.respondent.organisationName}
      />
    </Field>
    <Field label="Assessment date" inputId="respondent-assessmentDate">
      <DateInput
        id="respondent-assessmentDate"
        label="Assessment date"
        bind:value={store.data.respondent.assessmentDate}
      />
    </Field>
    <Field label="Assessment cadence" inputId="respondent-assessmentPeriod">
      <Select
        id="respondent-assessmentPeriod"
        label="Assessment cadence"
        bind:value={store.data.respondent.assessmentPeriod}
      >
        <option value="">—</option>
        <option value="sprint">Per sprint</option>
        <option value="quarter">Quarterly</option>
        <option value="half-year">Half-yearly</option>
        <option value="annual">Annual</option>
        <option value="ad-hoc">Ad-hoc</option>
      </Select>
    </Field>
  </div>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid { grid-template-columns: 1fr; }
  }
</style>
