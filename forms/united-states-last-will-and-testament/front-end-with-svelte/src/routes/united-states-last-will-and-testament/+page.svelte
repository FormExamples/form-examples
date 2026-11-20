<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces — the will wizard and the
  // drafter dashboard.
  const plural = 'united-states-last-will-and-testaments';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-last-will-and-testament/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new will plan</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step will plan. One continuous single-page wizard that classifies and
        validates the plan as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-last-will-and-testament/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Drafter dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse will plans with their computed validity class and flag count, and filter by validity
        class.
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
          Capture a United States will plan and produce a graded report: a validity class, the
          residuary total, the estimated spousal elective share, and flagged issues, to support a
          complete will that meets the formalities of the testator's state. Validity decisions rest
          with the probate court and a licensed attorney, not this software.
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
          Drawn from the Uniform Probate Code (UPC 2-501 to 2-505), the Revised Uniform Fiduciary
          Access to Digital Assets Act, and the statutes of California, New York, Texas, Florida,
          Illinois, Pennsylvania, Ohio and Washington. Documentation support, not legal advice.
        </dd>
      </div>
    </dl>
  </section>
</main>
