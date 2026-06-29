<script lang="ts">
  import FormField from '$lib/components/ui/FormField.svelte';
  import NumberField from '$lib/components/ui/NumberField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';

  const reg = $derived(lpaStore.application.registration);
  function changed() {
    lpaStore.recompute();
  }
</script>

<div class="space-y-4">
  <p class="text-sm text-base-content/70">
    LP1H Part C — application to register the LPA with the Office of the Public Guardian.
  </p>

  <div class="grid gap-3 sm:grid-cols-2">
    <SelectField
      label="Applicant"
      required
      bind:value={reg.applicantRole}
      onchange={changed}
      options={[
        { value: 'donor', label: 'Donor' },
        { value: 'attorney', label: 'One attorney' },
        { value: 'attorneys-jointly', label: 'All attorneys jointly' },
      ]}
    />
    <FormField
      label="Applicant signed at"
      type="datetime-local"
      required
      bind:value={reg.applicantSignedAt}
      onchange={changed}
    />
    <NumberField
      label="Fee amount (£)"
      bind:value={reg.feeAmountPounds}
      min={0}
      step={0.01}
      hint="Standard £82 (2026); zero when fully exempt."
      onchange={changed}
    />
    <SelectField
      label="Fee remission"
      bind:value={reg.feeRemission}
      onchange={changed}
      options={[
        { value: 'none', label: 'None — full fee' },
        { value: 'half', label: 'Half remission (50%)' },
        { value: 'full-exempt', label: 'Full exemption' },
      ]}
    />
    {#if reg.feeRemission !== '' && reg.feeRemission !== 'none'}
      <div class="sm:col-span-2">
        <SelectField
          label="Remission reason"
          bind:value={reg.feeRemissionReason}
          onchange={changed}
          options={[
            { value: 'low-income', label: 'Low income (gross household income < £12,000)' },
            { value: 'universal-credit', label: 'Receives Universal Credit' },
            { value: 'income-support', label: 'Receives Income Support' },
            { value: 'pension-credit-guarantee', label: 'Pension Credit (guarantee element)' },
            { value: 'housing-benefit', label: 'Housing Benefit' },
            { value: 'employment-and-support-allowance', label: 'Employment and Support Allowance' },
            { value: 'jobseekers-allowance', label: 'Jobseeker’s Allowance (income-based)' },
            { value: 'working-tax-credit', label: 'Working Tax Credit (with disability element)' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </div>
    {/if}
    <SelectField
      label="Submission channel"
      bind:value={reg.submissionChannel}
      onchange={changed}
      options={[
        { value: 'post', label: 'Post' },
        { value: 'opg-digital', label: 'OPG digital (Powers of Attorney Act 2023)' },
        { value: 'solicitor-portal', label: 'Solicitor portal' },
      ]}
    />
    <FormField
      label="Submitted at"
      type="datetime-local"
      bind:value={reg.submittedAt}
      onchange={changed}
    />
  </div>
</div>
