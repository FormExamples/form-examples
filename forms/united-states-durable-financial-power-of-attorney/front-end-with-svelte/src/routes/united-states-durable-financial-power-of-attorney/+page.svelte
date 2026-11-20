<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the certification wizard and the
  // clinician dashboard.
  const plural = 'united-states-durable-financial-power-of-attorneys';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-durable-financial-power-of-attorney/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new plan</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step plan. One continuous single-page wizard that checks your execution
        plan against the governing state rule as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-durable-financial-power-of-attorney/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Readiness dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse plans with their computed validity class, governing state rule, and flag count, and
        filter by validity class.
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
          Plan a durable power of attorney for property and finances and produce a readiness report:
          a validity class, the governing state rule, and flagged issues. Whether an instrument is
          valid is decided by the statute, the notary, and a court, not this software.
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
          Based on the Uniform Power of Attorney Act (2006) and the statutes of California, New
          York, Texas, Florida, Illinois, Pennsylvania, Ohio, and Washington. Other states use a
          uniform default. Documentation support, not legal advice.
        </dd>
      </div>
    </dl>
  </section>
</main>
