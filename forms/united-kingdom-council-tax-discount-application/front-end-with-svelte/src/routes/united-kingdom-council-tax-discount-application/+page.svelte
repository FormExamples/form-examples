<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the application wizard and the
  // dashboard.
  const plural = 'united-kingdom-council-tax-discount-applications';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-kingdom-council-tax-discount-application/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new application</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step application. One continuous single-page wizard that checks the
        application for completeness and eligibility as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-kingdom-council-tax-discount-application/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Applications dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse applications with their computed eligibility class, claim type, indicative outcome
        and flag count, and filter by eligibility class.
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
          Apply to a local council in England for a Council Tax discount, exemption or reduction and
          get a completeness and eligibility check with flagged issues. Eligibility is decided by
          the billing authority, not by this software.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the eligibility engine, and
          the flag rules. The same engine grades both the form and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from the GOV.UK Council Tax guidance and the Local Government Finance Act 1992. A
          pre-check only; tell the council within 21 days of any change in your circumstances.
        </dd>
      </div>
    </dl>
  </section>
</main>
