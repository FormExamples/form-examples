<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.pathway;

  const pathwayOptions = [
    { value: 'directed', label: 'Directed donation (to a named recipient)' },
    { value: 'altruistic', label: 'Altruistic (non-directed) donation' },
    { value: 'paired-exchange', label: 'Paired exchange' }
  ];
  const aboOptions = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'ab', label: 'AB' },
    { value: 'o', label: 'O' },
    { value: 'unknown', label: 'Unknown' }
  ];
</script>

<Fieldset legend="Step 3 of 7 · Pathway and ABO groups">
  <p class="hint">How the donation is arranged, and the donor and recipient blood groups.</p>

  <Field label="Donation pathway" required inputId="pathway-donationPathway">
    <Select
      id="pathway-donationPathway"
      label="Donation pathway"
      required
      bind:value={d.donationPathway}
    >
      <option value="">— Select —</option>
      {#each pathwayOptions as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </Select>
  </Field>

  <div class="field-grid">
    <Field
      label="Relationship of donor to recipient"
      inputId="pathway-relationshipOfDonorToRecipient"
    >
      <TextInput
        id="pathway-relationshipOfDonorToRecipient"
        label="Relationship of donor to recipient"
        bind:value={d.relationshipOfDonorToRecipient}
      />
    </Field>
    <Field
      label="Recipient transplant centre (if elsewhere)"
      inputId="pathway-recipientTransplantCentreName"
    >
      <TextInput
        id="pathway-recipientTransplantCentreName"
        label="Recipient transplant centre"
        bind:value={d.recipientTransplantCentreName}
      />
    </Field>
  </div>

  <h3 class="subhead">ABO groups</h3>
  <div class="field-grid">
    <Field label="Donor ABO group" inputId="pathway-donorAboGroup">
      <Select id="pathway-donorAboGroup" label="Donor ABO group" bind:value={d.donorAboGroup}>
        <option value="">— Select —</option>
        {#each aboOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
    <Field label="Recipient ABO group" inputId="pathway-recipientAboGroup">
      <Select
        id="pathway-recipientAboGroup"
        label="Recipient ABO group"
        bind:value={d.recipientAboGroup}
      >
        <option value="">— Select —</option>
        {#each aboOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
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
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
  .subhead {
    margin: 1rem 0 0.25rem;
    font-weight: 600;
  }
</style>
