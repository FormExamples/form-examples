<script lang="ts">
  import FormField from '#lib/components/ui/FormField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
  import YesNoField from '#lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '#lib/stores/lpa.svelte.js';

  const donor = $derived(lpaStore.application.donor);
  function changed() {
    lpaStore.recompute();
  }
</script>

<div class="grid gap-4 sm:grid-cols-2">
  <FormField label="Given names" required bind:value={donor.givenNames} onchange={changed} />
  <FormField label="Family name" required bind:value={donor.familyName} onchange={changed} />
  <FormField
    label="Other names used"
    bind:value={donor.otherNamesUsed}
    hint="Any other names the donor has been known by (LP1H s.1)."
    onchange={changed}
  />
  <FormField label="Date of birth" type="date" required bind:value={donor.birthDate} onchange={changed} />
  <FormField label="Email" type="email" bind:value={donor.email} onchange={changed} />
  <FormField label="Telephone" type="tel" bind:value={donor.phone} onchange={changed} />
  <div class="sm:col-span-2">
    <FormField
      label="Postal address (full text)"
      required
      bind:value={donor.postalAddressAsFullText}
      onchange={changed}
    />
  </div>
  <FormField label="Postcode" bind:value={donor.postcode} onchange={changed} />
  <FormField
    label="Country (ISO 3166-1 alpha-2)"
    bind:value={donor.countryAsIso31661Alpha2}
    hint="GB for the UK; other codes raise a foreign-domicile flag."
    onchange={changed}
  />
  <FormField
    label="NHS number"
    bind:value={donor.unitedKingdomNhsNumber}
    hint="Optional. Used for cross-form ADRT check."
    onchange={changed}
  />
  <SelectField
    label="Jurisdiction"
    required
    bind:value={donor.jurisdiction}
    onchange={changed}
    options={[
      { value: 'england', label: 'England' },
      { value: 'wales', label: 'Wales' },
    ]}
  />
  <SelectField
    label="Preferred language"
    bind:value={donor.preferredLanguage}
    onchange={changed}
    options={[
      { value: 'en', label: 'English' },
      { value: 'cy', label: 'Cymraeg (Welsh)' },
    ]}
  />
  <YesNoField
    label="Donor declares mental capacity at signing"
    bind:value={donor.capacityDeclared}
    hint="MCA 2005 s.9(2)(b). Required for the LPA to be valid."
    onchange={changed}
  />
  <FormField
    label="Capacity declared at"
    type="datetime-local"
    bind:value={donor.capacityDeclaredAt}
    onchange={changed}
  />
</div>
