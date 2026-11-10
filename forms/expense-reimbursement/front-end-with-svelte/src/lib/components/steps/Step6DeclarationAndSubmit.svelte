<script lang="ts">
  import Alert from '#lib/components/ui/Alert.svelte';
  import Badge from '#lib/components/ui/Badge.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import { CheckboxGroup, CheckboxInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import { calculateGrade } from '#lib/engine/grader.js';
  import {
    approvalTierColor,
    approvalTierLabel,
    complianceColor,
    complianceLabel,
    formatMoney,
    recommendationColor,
    recommendationLabel
  } from '#lib/engine/utils.js';
  import { claimStore } from '#lib/stores/result.svelte.js';

  // Live preview of the three-axis grade as the claim is edited.
  const preview = $derived(calculateGrade(claimStore.data));
  const currency = $derived(claimStore.data.claim.currency || 'GBP');
</script>

<Fieldset legend="6. Declaration and Submit">
  <p class="hint">
    Confirm the claim is honest, then submit to compute the three-axis grade and flags.
  </p>

  <Field label="Declarations" inputId="declWhollyForWork">
    <CheckboxGroup label="Declarations">
      <label
        ><CheckboxInput
          label="Incurred wholly for work"
          bind:checked={claimStore.data.declarations.whollyForWork}
        /> These expenses were incurred wholly for work</label
      >
      <label
        ><CheckboxInput
          label="No duplicate claim"
          bind:checked={claimStore.data.declarations.noDuplicateClaim}
        /> I have not claimed any of these expenses before</label
      >
      <label
        ><CheckboxInput
          label="Receipts attached"
          bind:checked={claimStore.data.declarations.receiptsAttached}
        /> I have attached the receipts</label
      >
    </CheckboxGroup>
  </Field>

  <Field label="Type your name to sign" inputId="declSignedName" required>
    <TextInput
      id="declSignedName"
      label="Type your name to sign"
      bind:value={claimStore.data.declarations.signedName}
      required
    />
  </Field>

  {#if preview.complianceBand === 'likely-ineligible'}
    <Alert type="error" heading="Likely ineligible">
      <p>
        At least one line looks like alcohol or a personal item, which is never reimbursable. Remove
        it or explain it before submitting.
      </p>
    </Alert>
  {:else if preview.complianceBand === 'needs-review'}
    <Alert type="warning" heading="Needs review">
      <p>
        Some lines break a default policy rule (missing receipt, stale, or no prior approval). The
        approver will need to review them.
      </p>
    </Alert>
  {/if}

  <div class="mt-4 flex flex-wrap gap-2" aria-label="Live grade preview">
    <Badge
      label="Compliance: {complianceLabel(preview.complianceBand)}"
      color={complianceColor(preview.complianceBand)}
    />
    <Badge
      label="Approval: {approvalTierLabel(preview.approvalTier)}"
      color={approvalTierColor(preview.approvalTier)}
    />
    <Badge
      label="Complete: {preview.completenessPercent}%"
      color="bg-base-300 text-base-content border-base-300"
    />
    <Badge
      label={recommendationLabel(preview.recommendation)}
      color={recommendationColor(preview.recommendation)}
    />
  </div>
  <p class="hint mt-2">Amount to repay {formatMoney(preview.amountToRepay, currency)}</p>
</Fieldset>
