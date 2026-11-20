<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the application wizard and the
  // preparer dashboard.
  const plural = 'united-states-social-security-card-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-social-security-card-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step Form SS-5. One continuous single-page wizard that checks the form and
        the evidence as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-social-security-card-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Preparer dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed class, evidence-gap count, and flag count, and
        filter by class.
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
          Prepare a Social Security card application (Form SS-5) and produce a readiness report: a
          class (ready to submit, incomplete, evidence missing, or not eligible) and flagged issues.
          The Social Security Administration decides every application, not this software, and the
          Social Security number is never collected.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the classification engine, and
          the flag rules. The same engine checks both the form and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from the SS-5 instructions, 20 CFR 422.103 and 422.107, and SSA policy on
          replacement-card limits (3 per year, 10 per lifetime). Documentation support, not legal
          advice. The rules are federal and do not vary by state.
        </dd>
      </div>
    </dl>
  </section>
</main>
