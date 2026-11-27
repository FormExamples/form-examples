<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.referrer;

  const roleOptions = [
    { value: 'haematologist', label: 'Haematologist' },
    { value: 'transplant-physician', label: 'Transplant physician' },
    { value: 'transplant-coordinator', label: 'Transplant coordinator' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'phlebotomist', label: 'Phlebotomist' },
    { value: 'other', label: 'Other' }
  ];
</script>

<Fieldset legend="Step 2 of 8 · Referrer and report">
  <p class="hint">
    Who is requesting the typing and where the report goes. Use an authorized secure email address
    only.
  </p>

  <div class="field-grid">
    <Field label="Referrer name" required inputId="referrer-clinicianName">
      <TextInput
        id="referrer-clinicianName"
        label="Referrer name"
        required
        bind:value={d.clinicianName}
      />
    </Field>
    <Field label="Role" inputId="referrer-clinicianRole">
      <Select id="referrer-clinicianRole" label="Role" bind:value={d.clinicianRole}>
        <option value="">— Select —</option>
        {#each roleOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Department" inputId="referrer-department">
      <TextInput id="referrer-department" label="Department" bind:value={d.department} />
    </Field>
    <Field label="Hospital or organization" inputId="referrer-organization">
      <TextInput
        id="referrer-organization"
        label="Hospital or organization"
        bind:value={d.organization}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Referrer email" inputId="referrer-clinicianEmail">
      <TextInput
        id="referrer-clinicianEmail"
        label="Referrer email"
        type="email"
        bind:value={d.clinicianEmail}
      />
    </Field>
    <Field label="Report email" inputId="referrer-reportEmail">
      <TextInput
        id="referrer-reportEmail"
        label="Report email"
        type="email"
        bind:value={d.reportEmail}
      />
    </Field>
  </div>

  <Field label="Copy of report to" inputId="referrer-copyOfReportTo">
    <TextInput
      id="referrer-copyOfReportTo"
      label="Copy of report to"
      bind:value={d.copyOfReportTo}
    />
  </Field>
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
</style>
