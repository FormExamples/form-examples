<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the bill-of-sale wizard and the review
  // dashboard.
  const plural = 'united-states-vehicle-bills-of-sale';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-vehicle-bill-of-sale/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new bill of sale</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step bill of sale. One continuous single-page wizard that classifies the
        sale as complete, incomplete, or risk flagged as you fill it in.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-vehicle-bill-of-sale/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Review dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse bills of sale with their completeness class, lead issue, and flag count, and filter
        by class.
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
          Document a private vehicle sale and produce a graded report — a completeness class and
          flagged issues — covering the parties, the vehicle and VIN, the price, the as-is clause,
          the federal odometer disclosure, title and lien status, state notarization, sales-tax
          basis, and the release of liability. Documentation support, not legal advice: the state
          motor vehicle agency decides.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the classification engine, the
          state-rule table, and the flag rules. The same engine grades both the form and the
          dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from 49 CFR Part 580 (odometer disclosure, under the Truth in Mileage Act) and the
          published rules of a handful of states. State rules vary; unknown states fall back to a
          uniform default with a verify-state-rule flag.
        </dd>
      </div>
    </dl>
  </section>
</main>
