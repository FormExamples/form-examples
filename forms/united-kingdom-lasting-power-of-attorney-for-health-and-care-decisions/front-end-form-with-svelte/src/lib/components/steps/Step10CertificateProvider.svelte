<script lang="ts">
  import FormField from '$lib/components/ui/FormField.svelte';
  import NumberField from '$lib/components/ui/NumberField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';
  import { emptyCertificateProvider } from '$lib/engine/factory.js';

  function changed() {
    lpaStore.recompute();
  }
  function ensureCp() {
    if (!lpaStore.application.certificateProvider) {
      lpaStore.application.certificateProvider = emptyCertificateProvider();
      changed();
    }
  }
  ensureCp();
  const cp = $derived(lpaStore.application.certificateProvider!);

  const PROFESSIONS = [
    { value: 'solicitor', label: 'Solicitor' },
    { value: 'barrister', label: 'Barrister' },
    { value: 'general-practitioner', label: 'General practitioner' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'registered-nurse', label: 'Registered nurse' },
    { value: 'registered-social-worker', label: 'Registered social worker' },
    { value: 'imca', label: 'Independent Mental Capacity Advocate' },
    { value: 'psychiatrist', label: 'Psychiatrist' },
    { value: 'psychologist', label: 'Psychologist' },
    { value: 'other-registered-professional', label: 'Other registered professional' },
  ];
</script>

<div class="space-y-4">
  <p class="text-sm text-slate-600">
    The certificate provider certifies that the donor understands the LPA and is not under
    undue pressure. Cannot be a family member, business partner, employee, or attorney.
  </p>

  <div class="grid gap-3 sm:grid-cols-2">
    <FormField label="Given names" required bind:value={cp.givenNames} onchange={changed} />
    <FormField label="Family name" required bind:value={cp.familyName} onchange={changed} />
    <div class="sm:col-span-2">
      <FormField label="Postal address" bind:value={cp.postalAddressAsFullText} onchange={changed} />
    </div>
    <FormField label="Email" type="email" bind:value={cp.email} onchange={changed} />
    <FormField label="Telephone" type="tel" bind:value={cp.phone} onchange={changed} />
  </div>

  <SelectField
    label="Eligibility route"
    required
    bind:value={cp.route}
    onchange={changed}
    options={[
      { value: 'skill-based', label: 'Skill-based (registered profession)' },
      { value: 'knowledge-based', label: 'Knowledge-based (known donor ≥ 2 years)' },
    ]}
  />

  {#if cp.route === 'skill-based'}
    <div class="grid gap-3 sm:grid-cols-2">
      <SelectField
        label="Profession"
        required
        bind:value={cp.profession}
        options={PROFESSIONS}
        onchange={changed}
      />
      <FormField
        label="Registration number"
        bind:value={cp.professionRegistrationNumber}
        hint="SRA, GMC, NMC, HCPC, or equivalent."
        onchange={changed}
      />
    </div>
  {:else if cp.route === 'knowledge-based'}
    <NumberField
      label="Years known the donor"
      bind:value={cp.yearsKnownDonor}
      min={0}
      step={0.5}
      hint="Must be at least 2 years for the knowledge-based route."
      onchange={changed}
    />
  {/if}

  <div class="grid gap-3 sm:grid-cols-3">
    <YesNoField
      label="Not a family member of donor or attorneys?"
      bind:value={cp.declaredNotFamily}
      onchange={changed}
    />
    <YesNoField
      label="Not a business partner or employee?"
      bind:value={cp.declaredNotEmployee}
      onchange={changed}
    />
    <YesNoField
      label="Not an attorney in this LPA?"
      bind:value={cp.declaredNotAttorney}
      onchange={changed}
    />
  </div>
</div>
