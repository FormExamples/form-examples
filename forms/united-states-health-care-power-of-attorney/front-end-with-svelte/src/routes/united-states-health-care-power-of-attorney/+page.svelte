<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the directive wizard and the
  // reviewer dashboard.
  const plural = 'united-states-health-care-powers-of-attorney';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-health-care-power-of-attorney/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new directive</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step directive. One continuous single-page wizard that checks the agent,
        the witnesses, and the signing method against your state as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-health-care-power-of-attorney/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Reviewer dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse directives with their computed readiness class, state, and flag count, and filter by
        readiness class.
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
          Prepare a United States durable power of attorney for health care and produce a readiness
          report: a class (ready to execute, incomplete, or execution risk) and flagged issues. It
          is documentation support, not legal advice; a court, the treating facility, and the state
          decide whether a directive is valid.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the readiness engine, and the
          flag rules. The same engine grades both the form and the dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Organized around the Uniform Health-Care Decisions Act, the federal Patient
          Self-Determination Act, HIPAA, and the witness and notary rules of eight states
          (California, Florida, Illinois, New York, Ohio, Pennsylvania, Texas, Washington); other
          states use the uniform default and a verify flag. A POLST is a separate medical order.
        </dd>
      </div>
    </dl>
  </section>
</main>
