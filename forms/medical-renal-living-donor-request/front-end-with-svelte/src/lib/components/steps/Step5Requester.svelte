<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.requester;

  const roleOptions = [
    { value: 'nephrologist', label: 'Nephrologist' },
    { value: 'transplant-surgeon', label: 'Transplant surgeon' },
    { value: 'transplant-coordinator', label: 'Transplant coordinator' },
    { value: 'independent-assessor', label: 'Independent assessor' },
    { value: 'phlebotomist', label: 'Phlebotomist' },
    { value: 'other', label: 'Other' }
  ];
</script>

<Fieldset legend="Step 5 of 7 · Requester">
  <p class="hint">
    Who is requesting the tests. The requester is responsible for the donor's informed consent and
    identity verification.
  </p>

  <div class="field-grid">
    <Field label="Requester name" required inputId="requester-clinicianName">
      <TextInput
        id="requester-clinicianName"
        label="Requester name"
        required
        bind:value={d.clinicianName}
      />
    </Field>
    <Field label="Role" inputId="requester-clinicianRole">
      <Select id="requester-clinicianRole" label="Role" bind:value={d.clinicianRole}>
        <option value="">— Select —</option>
        {#each roleOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Email" inputId="requester-clinicianEmail">
      <TextInput
        id="requester-clinicianEmail"
        label="Email"
        type="email"
        bind:value={d.clinicianEmail}
      />
    </Field>
    <Field label="Transplant centre" inputId="requester-transplantCentreName">
      <TextInput
        id="requester-transplantCentreName"
        label="Transplant centre"
        bind:value={d.transplantCentreName}
      />
    </Field>
  </div>

  <Field label="Signed at" inputId="requester-requestedBySignedAt">
    <TextInput
      id="requester-requestedBySignedAt"
      label="Signed at"
      type="datetime-local"
      bind:value={d.requestedBySignedAt}
    />
  </Field>

  <label class="bool-field">
    <CheckboxInput
      id="requester-consentAndIdentityConfirmed"
      label="I confirm the donor's informed consent was obtained and identity verified"
      bind:checked={d.consentAndIdentityConfirmed}
    />
    <span>I confirm the donor's informed consent was obtained and identity verified</span>
  </label>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
