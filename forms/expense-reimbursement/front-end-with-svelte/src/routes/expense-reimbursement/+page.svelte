<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the claim form and the claims
  // dashboard. The collection routes (`/expense-reimbursements` and
  // `/expense-reimbursements/new`) hold the actual functionality.
  const plural = 'expense-reimbursements';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/expense-reimbursement/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new claim</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step claim form. One continuous single-page wizard that grades the claim as
        you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/expense-reimbursement/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Claims dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse claims with their computed three-axis grades, and filter by approval tier and
        recommendation.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
    </a>
  </div>

  <section class="mt-12">
    <h2 class="text-lg font-semibold text-base-content">About this work</h2>
    <dl class="mt-4 space-y-4 text-sm">
      <div>
        <dt class="font-semibold text-base-content">Purpose</dt>
        <dd class="mt-1 text-base-content/70">
          A worker, such as a clinician, who paid a work-related expense from their own money asks
          to be repaid. Record who is claiming and who approves, what the expenses were for, one
          entry per receipt, how to repay, and a declaration — and produce a structured claim the
          approver can accept, query, escalate or reject.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the three-axis grading engine
          (policy compliance, completeness, approval tier), and the fraud-prevention flag rules. The
          same engine grades both the form and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Policy</dt>
        <dd class="mt-1 text-base-content/70">
          Default thresholds: receipts over £10, prior approval over £50, claims within 90 days, and
          approval tiers at £100 and £500. Alcohol and personal items are never reimbursable. Your
          employer's own policy has the final say.
        </dd>
      </div>
    </dl>
  </section>
</main>
