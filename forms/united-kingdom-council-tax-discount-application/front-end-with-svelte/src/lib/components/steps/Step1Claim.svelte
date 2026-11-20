<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const c = assessment.data.claim;
</script>

<Fieldset legend="Step 1 of 5 — Claim">
  <p class="hint">
    Which Council Tax discount, exemption or reduction you are applying for, to which council, and
    from when. Eligibility is decided by the billing authority, not by this form.
  </p>

  <Field label="What are you applying for?" inputId="claim-claimType">
    <Select id="claim-claimType" label="What are you applying for?" bind:value={c.claimType}>
      <option value="">— Select —</option>
      <option value="single-person-discount">Single person discount (25%)</option>
      <option value="all-disregarded-discount">Everyone disregarded (50% discount)</option>
      <option value="student-exemption">Full-time student exemption</option>
      <option value="severe-mental-impairment">Severe mental impairment disregard</option>
      <option value="disabled-band-reduction">Disabled band reduction</option>
      <option value="care-leaver-relief">Care leaver relief</option>
      <option value="council-tax-reduction">Council Tax Reduction (means-tested)</option>
    </Select>
  </Field>
  <Field label="Billing authority (your local council in England)" inputId="claim-billingAuthority">
    <TextInput
      id="claim-billingAuthority"
      label="Billing authority (your local council in England)"
      placeholder="e.g. Leeds City Council"
      bind:value={c.billingAuthority}
    />
  </Field>
  <Field label="Council Tax account reference" inputId="claim-accountReference">
    <TextInput
      id="claim-accountReference"
      label="Council Tax account reference"
      placeholder="e.g. 123456789"
      bind:value={c.accountReference}
    />
  </Field>
  <Field label="Date of this application" inputId="claim-applicationDate">
    <DateInput
      id="claim-applicationDate"
      label="Date of this application"
      bind:value={c.applicationDate}
    />
  </Field>
  <Field label="Date the discount should start from" inputId="claim-effectiveDate">
    <DateInput
      id="claim-effectiveDate"
      label="Date the discount should start from"
      bind:value={c.effectiveDate}
    />
  </Field>
</Fieldset>
