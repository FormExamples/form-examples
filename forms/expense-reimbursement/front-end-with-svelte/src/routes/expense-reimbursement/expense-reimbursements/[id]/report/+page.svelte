<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { claimStore } from '#lib/stores/result.svelte.js';
  import Badge from '#lib/components/ui/Badge.svelte';
  import Alert from '#lib/components/ui/Alert.svelte';
  import { Button } from '@lilydesignsystem/svelte-headless';
  import { calculateGrade } from '#lib/engine/grader.js';
  import { usedItems } from '#lib/engine/rules.js';
  import {
    approvalTierColor,
    approvalTierLabel,
    categoryLabel,
    complianceColor,
    complianceLabel,
    formatMoney,
    priorityColor,
    recommendationColor,
    statusLabel
  } from '#lib/engine/utils.js';

  const id = $derived(page.params.id ?? 'new');
  const data = $derived(claimStore.data);
  // A direct visit (no submit this session) still shows a report: grade on demand.
  const result = $derived(claimStore.result ?? calculateGrade(claimStore.data));
  const currency = $derived(data.claim.currency || 'GBP');
  const lines = $derived(usedItems(data));
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-4 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Expense Reimbursement Report</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Claim {id} · Worker: {data.worker.name || '—'} · Claim: {data.claim.title || '—'} · Approver:
        {data.manager.name || '—'} · Status: {statusLabel(data.claim.status)}
      </p>
    </div>
    <div class="flex gap-2 no-print">
      <Button data-variant="secondary" onclick={() => window.print()}>Print / save PDF</Button>
      <Button
        data-variant="secondary"
        onclick={() => goto(`/expense-reimbursement/expense-reimbursements/${id}`)}
        >Back to the form</Button
      >
    </div>
  </div>

  <div class="mb-6 flex flex-wrap gap-2">
    <Badge label={result.recommendationLabel} color={recommendationColor(result.recommendation)} />
    <Badge
      label={approvalTierLabel(result.approvalTier)}
      color={approvalTierColor(result.approvalTier)}
    />
  </div>

  {#if result.complianceBand === 'likely-ineligible'}
    <Alert type="error" heading="Likely ineligible">
      <p>At least one line looks like alcohol or a personal item, which is never reimbursable.</p>
    </Alert>
  {/if}

  <h2 class="mt-6 text-lg font-semibold">Three-axis grade</h2>
  <div class="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
    <div class="rounded-lg border border-base-300 bg-base-100 p-3">
      <div class="text-xs text-base-content/60">A · Policy compliance</div>
      <div class="mt-1">
        <Badge
          label={complianceLabel(result.complianceBand)}
          color={complianceColor(result.complianceBand)}
        />
      </div>
    </div>
    <div class="rounded-lg border border-base-300 bg-base-100 p-3">
      <div class="text-xs text-base-content/60">B · Completeness</div>
      <div class="mt-1 text-xl font-bold">{result.completenessPercent}%</div>
    </div>
    <div class="rounded-lg border border-base-300 bg-base-100 p-3">
      <div class="text-xs text-base-content/60">C · Approval tier</div>
      <div class="mt-1">
        <Badge
          label={approvalTierLabel(result.approvalTier)}
          color={approvalTierColor(result.approvalTier)}
        />
      </div>
    </div>
    <div class="rounded-lg border border-base-300 bg-base-100 p-3">
      <div class="text-xs text-base-content/60">Amount to repay</div>
      <div class="mt-1 text-xl font-bold">{formatMoney(result.amountToRepay, currency)}</div>
      <div class="text-xs text-base-content/60">
        Claim total {formatMoney(result.total, currency)}
      </div>
    </div>
  </div>

  <h2 class="mt-8 text-lg font-semibold">Expenses</h2>
  <table class="mt-2 w-full text-left text-sm">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Date</th>
        <th scope="col">Category</th>
        <th scope="col">Description</th>
        <th scope="col">Merchant</th>
        <th scope="col">Amount</th>
        <th scope="col">Receipt</th>
      </tr>
    </thead>
    <tbody>
      {#each lines as item (item.lineNumber)}
        <tr>
          <th scope="row">{item.lineNumber}</th>
          <td>{item.expenseDate || '—'}</td>
          <td>{item.category ? categoryLabel(item.category) : '—'}</td>
          <td>{item.description || '—'}</td>
          <td>{item.merchant || '—'}</td>
          <td>
            {item.currency}
            {item.amount === null ? '—' : item.amount.toFixed(2)}
          </td>
          <td>{item.receiptAttached ? 'Yes' : 'No'}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2 class="mt-8 text-lg font-semibold">Fired rules</h2>
  <table class="mt-2 w-full text-left text-sm">
    <thead>
      <tr>
        <th scope="col">Rule</th>
        <th scope="col">Axis</th>
        <th scope="col">Category</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
      {#each result.firedRules as rule (rule.ruleId + rule.description)}
        <tr>
          <th scope="row">{rule.ruleId}</th>
          <td>{rule.axis}</td>
          <td>{rule.category}</td>
          <td>{rule.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2 class="mt-8 text-lg font-semibold">Policy &amp; fraud-prevention flags</h2>
  {#if result.flags.length === 0}
    <p class="mt-2 text-sm text-base-content/70">No policy or fraud-prevention flags raised.</p>
  {:else}
    <ul class="mt-2 space-y-2">
      {#each result.flags as flag (flag.flagId)}
        <li class="rounded-lg border border-base-300 bg-base-100 p-3 text-sm">
          <Badge label={flag.priority.toUpperCase()} color={priorityColor(flag.priority)} />
          <span class="ml-2 font-semibold">{flag.category}</span>
          <p class="mt-1">{flag.description}</p>
          <p class="mt-1 text-base-content/70">{flag.suggestedAction}</p>
        </li>
      {/each}
    </ul>
  {/if}

  <p class="mt-8 text-xs text-base-content/60">
    Grading applies default policy thresholds (receipts over £10, prior approval over £50, claims
    within 90 days, approval tiers at £100 and £500). This tool supports the approver; the decision
    to repay remains the employer's.
  </p>
</main>
