<script lang="ts">
  // The app root is a welcome page: it explains the work and offers prominent
  // links to the two working surfaces: the petition wizard and the petitions
  // dashboard.
  const plural = 'united-states-divorce-petitions';
</script>

<main class="mx-16 px-4 py-12">
  <div class="grid gap-4 sm:grid-cols-2">
    <a
      href="/united-states-divorce-petition/{plural}/new"
      class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
    >
      <h2 class="text-lg font-semibold">Start a new petition</h2>
      <p class="mt-2 text-sm text-primary-content/80">
        Open the step-by-step petition. One continuous single-page wizard that checks the filing
        state's residency and waiting-period rules as you complete it.
      </p>
      <span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
    </a>
    <a
      href="/united-states-divorce-petition/{plural}"
      class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
    >
      <h2 class="text-lg font-semibold">Petitions dashboard</h2>
      <p class="mt-2 text-sm text-base-content/70">
        Browse petitions with their computed readiness class, earliest permitted decree date, and
        flag count, and filter by readiness class.
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
          Capture a petition for dissolution of marriage, the decree, and the divorce certificate
          request, and produce a readiness report: ready to file, incomplete, or not yet eligible,
          with the property regime, the earliest permitted decree date, and flagged issues. This is
          documentation support, not legal advice; the court decides.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Specification</dt>
        <dd class="mt-1 text-base-content/70">
          Spec-driven: the living domain spec defines the data model, the state-rule table, the
          classification engine, and the flag rules. The same engine checks the form and the
          dashboard.
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-base-content">Documentation</dt>
        <dd class="mt-1 text-base-content/70">
          Verified rules for California, New York, Texas, Florida, Illinois, Pennsylvania, Ohio,
          Washington, Arizona, and Nevada; the UCCJEA home-state test; and the Servicemembers Civil
          Relief Act. Other states fall back to a default rule with a verify-state-rule flag.
        </dd>
      </div>
    </dl>
  </section>
</main>
