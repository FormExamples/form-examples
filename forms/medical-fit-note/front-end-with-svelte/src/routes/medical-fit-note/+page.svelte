<script lang="ts">
  // The form root is a welcome page: a one-sentence summary, links to every
  // route choice, then a plain-language explanation of the form and its
  // specification. The collection routes hold the actual functionality.
  const plural = 'medical-fit-notes';
</script>

<header class="page-header no-print">
  <div class="page-header-inner">
    <h1>Medical Fit Note</h1>
    <p class="subtitle">
      A clinician signs and approves a fit note for an employee on sick leave, and the engine checks
      it is complete before it is issued.
    </p>
  </div>
</header>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/medical-fit-note/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new fit note</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step wizard. One continuous single-page form that shows whether the note is
        approved, needs completion or is blocked as you fill it in.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/medical-fit-note/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Clinician dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse fit notes with their fitness advice, period, adjustments, approval status and flags,
        and filter by approval status and advice.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
    </a>
  </div>

  <section class="mt-12">
    <h2 class="text-lg font-semibold text-base-content">About this form</h2>
    <dl class="mt-4 space-y-4 text-sm">
      <div>
        <dt class="font-semibold text-base-content">What it captures</dt>
        <dd class="mt-1 text-base-content/70">
          The employee, when and how they were assessed, their condition, the fitness advice (not
          fit for work, or may be fit for work), any adjustments such as a phased return, the period
          the advice covers, the employee's consent to share with the employer, and the clinician's
          declaration and registration details.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">What the engine computes</dt>
        <dd class="mt-1 text-base-content/70">
          Nine plain rules (R-01 to R-09) check the note is complete and consistent. The worst
          effect wins: the note is Approved, Needs completion, or Blocked, with the rules that fired
          and a flag for each gap, so nothing safety-relevant is silently missing.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the approval engine and the
          flag rules, and the same engine grades the wizard, the dashboard and the report. It
          handles special-category health data, so consent to share with the employer is recorded
          explicitly.
        </dd>
      </div>
    </dl>
  </section>
</main>
