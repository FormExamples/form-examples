<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { REGISTRATION_BODY_OPTIONS, ROLE_OPTIONS, YES_NO_OPTIONS } from '#lib/engine/utils.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import YesCheckbox from './YesCheckbox.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
</script>

<Fieldset legend="Step 7 of 8 — Consent and sign-off" id="step-7-legend">
  <p class="hint">
    Employee consent, then the clinician declaration and registration (rules R-06, R-07).
  </p>
  <Field label="Employee consents to sharing with the employer" inputId="step-7-consent">
    <Select
      id="step-7-consent"
      label="Employee consents to sharing with the employer"
      bind:value={store.data.employeeConsentToShare}
    >
      <option value="">— Select —</option>
      {#each YES_NO_OPTIONS as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>

  <h3>Clinician</h3>
  <div class="field-grid">
    <Field label="Clinician name" inputId="step-7-clinician-name">
      <TextInput
        id="step-7-clinician-name"
        label="Clinician name"
        bind:value={store.data.clinicianName}
      />
    </Field>
    <Field label="Clinician role" inputId="step-7-clinician-role">
      <Select
        id="step-7-clinician-role"
        label="Clinician role"
        bind:value={store.data.clinicianRole}
      >
        <option value="">— Select —</option>
        {#each ROLE_OPTIONS as o (o.value)}
          <option value={o.value}>{o.label}</option>
        {/each}
      </Select>
    </Field>
    <Field label="Registration body" inputId="step-7-registration-body">
      <Select
        id="step-7-registration-body"
        label="Registration body"
        bind:value={store.data.clinicianRegistrationBody}
      >
        <option value="">— Select —</option>
        {#each REGISTRATION_BODY_OPTIONS as o (o.value)}
          <option value={o.value}>{o.label}</option>
        {/each}
      </Select>
    </Field>
    <Field label="Registration number" inputId="step-7-registration-number">
      <TextInput
        id="step-7-registration-number"
        label="Registration number"
        bind:value={store.data.clinicianRegistrationNumber}
      />
    </Field>
  </div>
  <YesCheckbox
    id="step-7-declaration"
    label="I declare that this advice is my clinical opinion and I sign this fit note."
    bind:value={store.data.clinicianDeclaration}
  />
</Fieldset>
