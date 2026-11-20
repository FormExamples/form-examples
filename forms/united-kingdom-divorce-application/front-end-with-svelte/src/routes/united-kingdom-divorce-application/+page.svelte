<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the application wizard and the
  // caseworker dashboard.
  const plural = 'united-kingdom-divorce-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-kingdom-divorce-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new check</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step form. One continuous single-page wizard that checks the application
        and its time gates as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-kingdom-divorce-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Caseworker dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed readiness class, earliest eligible date and flag
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
          Check a divorce or civil-partnership dissolution application for England and Wales — the
          application, the conditional order and the final order — and produce a readiness class,
          the earliest eligible date and flagged issues. The court decides every application; this
          software gives no legal advice.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the readiness engine and the
          flag rules. The same engine grades both the form and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from the GOV.UK divorce guidance, the Divorce, Dissolution and Separation Act 2020
          and the Domicile and Matrimonial Proceedings Act 1973. A completeness aid, not the court
          form.
        </dd>
      </div>
    </dl>
  </section>
</main>
