<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the application wizard and the review
  // dashboard.
  const plural = 'united-states-marriage-license-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-marriage-license-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step application. One continuous single-page wizard that classifies the
        application and checks it against the state rule as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-marriage-license-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Review dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed class, earliest permitted ceremony date, and flag
        count, and filter by class.
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
          Prepare a United States marriage license application and, after the ceremony, the
          certified marriage certificate: a class (ready to apply, incomplete, or not eligible), the
          earliest permitted ceremony date, the license expiry, and flagged issues. The issuing
          county clerk or a court decides; this is documentation support, not legal advice.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the state rule table, the
          classification engine, and the flag rules. The same engine grades both the form and the
          dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          There is no federal marriage license: each state sets the rules and a county clerk issues
          the license. Same-sex couples may marry in every state (Obergefell v. Hodges, 2015). Ten
          states are encoded in detail; any other state uses a uniform default and raises a flag to
          verify the rule.
        </dd>
      </div>
    </dl>
  </section>
</main>
