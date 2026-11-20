<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.terms;
</script>

<Fieldset legend="Step 6 of 7 — Terms, title, and lien">
  <p class="hint">
    The as-is clause, whether the seller holds the title and has signed it over, any lien and its
    release, and notarization where the state requires it.
  </p>

  <Field label="Warranty terms" inputId="terms-asIsClause">
    <Select id="terms-asIsClause" label="Warranty terms" bind:value={p.asIsClause}>
      <option value="">— Select —</option>
      <option value="as-is">Sold as is, with no warranty</option>
      <option value="warranty">Sold with a written warranty</option>
    </Select>
  </Field>
  <p class="hint">
    An as-is sale says the buyer accepts the vehicle in its present condition with no warranty.
  </p>

  <Field label="Written warranty (if any)" inputId="terms-warrantyNote">
    <TextInput
      id="terms-warrantyNote"
      label="Written warranty (if any)"
      placeholder="What is covered and for how long"
      bind:value={p.warrantyNote}
    />
  </Field>

  <Field label="Seller holds the certificate of title?" inputId="terms-sellerHoldsTitle">
    <Select
      id="terms-sellerHoldsTitle"
      label="Seller holds the certificate of title?"
      bind:value={p.sellerHoldsTitle}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Seller has signed the title over to the buyer?" inputId="terms-titleSigned">
    <Select
      id="terms-titleSigned"
      label="Seller has signed the title over to the buyer?"
      bind:value={p.titleSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Lien status" inputId="terms-lienStatus">
    <Select id="terms-lienStatus" label="Lien status" bind:value={p.lienStatus}>
      <option value="">— Select —</option>
      <option value="none">No lien</option>
      <option value="released">Lien released (release in hand)</option>
      <option value="outstanding">Lien outstanding</option>
    </Select>
  </Field>
  <p class="hint">
    An outstanding lien must be paid off and released before a clear title can pass.
  </p>

  <Field label="Lienholder name" inputId="terms-lienholderName">
    <TextInput id="terms-lienholderName" label="Lienholder name" bind:value={p.lienholderName} />
  </Field>

  <Field label="Date the lien was released" inputId="terms-lienReleaseDate">
    <DateInput
      id="terms-lienReleaseDate"
      label="Date the lien was released"
      bind:value={p.lienReleaseDate}
    />
  </Field>

  <Field label="Notarized?" inputId="terms-notarized">
    <Select id="terms-notarized" label="Notarized?" bind:value={p.notarized}>
      <option value="">— Select —</option>
      <option value="yes">Yes, notarized</option>
      <option value="no">No, not notarized</option>
      <option value="not-required">Not required</option>
    </Select>
  </Field>
  <p class="hint">
    Some states (for example Pennsylvania and Ohio for the title, Louisiana for the bill of sale)
    require notarization.
  </p>
</Fieldset>
