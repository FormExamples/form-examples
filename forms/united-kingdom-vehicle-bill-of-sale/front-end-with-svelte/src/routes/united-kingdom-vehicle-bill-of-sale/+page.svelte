<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the bill-of-sale wizard and the
  // dashboard.
  const plural = 'united-kingdom-vehicle-bills-of-sale';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-kingdom-vehicle-bill-of-sale/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new bill of sale</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step bill of sale. One continuous single-page wizard that classifies it as
        complete, incomplete, or risk flagged as you fill it in.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-kingdom-vehicle-bill-of-sale/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse bills of sale with their computed classification, missing-item count, and risk count,
        and filter by classification.
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
          Record a private vehicle sale in the United Kingdom and produce a report: a classification
          (complete, incomplete, or risk flagged), the missing items, and flagged issues such as no
          VIN, outstanding finance, or a missing V5C. This is documentation support, not legal
          advice.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the classification /
          validation engine, and the flag rules. The same engine grades both the form and the
          dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Drawn from the GOV.UK guidance Buy a vehicle and Sell, scrap or transfer a vehicle, the
          Sale of Goods Act 1979, and the Consumer Rights Act 2015 (trader sales). Related forms:
          the DVLA forms in this collection and United Kingdom Vehicle Registration Application.
        </dd>
      </div>
    </dl>
  </section>
</main>
